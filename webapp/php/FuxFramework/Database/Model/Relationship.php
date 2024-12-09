<?php

namespace Fux\Database\Model;

use Fux\FuxQueryBuilder;

/**
 * The aim of this class is to represent a generic and binary relationship between two model classes. The term "binary"
 * references the number of models that can represent a relationship. In this case we have two model classes. Since
 * this class should be instantiated only inside another Model class, only the second model class have to be passed.
 */
class Relationship
{

    /** @property Model $baseInstance */
    public $baseInstance = null;
    public $startModel;
    public $startModelFields;
    public $endModel;
    public $endModelFields;
    public $cardinality;
    /** @property Relationship $parentRelationship */
    private $parentRelationship;
    private $selectableFields;

    /**
     * @param string $startModel he current model on which is defined the foreign key
     * @param string[] $startModelFkFields the field(s) of the current model on which is defined the foreign key
     * @param string $endModel the classname of the model on which is defined the foreign key
     * @param string[] $endModelFkFields the field(s) name
     *
     * @throws \Exception
     */
    public function __construct($startModel, $startModelFkFields, $endModel, $endModelFkFields, $baseInstance = null)
    {

        if (!class_exists($startModel))
            throw new \Exception("The class $startModel does not exists");

        if (!class_exists($endModel))
            throw new \Exception("The class $endModel does not exists");

        if ($baseInstance && !($baseInstance instanceof Model))
            throw new \Exception("The model instance is not instance of the Model class");

        if (!is_array($startModelFkFields))
            $startModelFkFields = [$startModelFkFields];

        if (!is_array($endModelFkFields))
            $endModelFkFields = [$endModelFkFields];

        if (count($startModelFkFields) != count($endModelFkFields))
            throw new \Exception("The foreign key fields have to be the same number for both models");

        $this->startModel = $startModel;
        $this->startModelFields = $startModelFkFields;
        $this->endModel = $endModel;
        $this->endModelFields = $endModelFkFields;
        $this->baseInstance = $baseInstance;
    }

    /**
     * Set the fields that have to be selected when resolving the relationship query
     *
     * @param string $fields,... The fields name that have to be selected
     *
     * @return self
     */
    public function select(...$fields)
    {
        $this->selectableFields = $fields;
        return $this;
    }

    /**
     * Add additional fields that have to be selected when resolving the relationship query
     *
     * @param string $fields,... The fields name that have to be selected
     *
     * @return self
     */
    public function selectAppend(...$fields)
    {
        $this->selectableFields = array_merge($this->selectableFields, $fields);
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSelectableFields()
    {
        return $this->selectableFields;
    }

    /**
     * Generate a query builder that take into account the whole anchestor relationship list using a multi-join select
     * query
     *
     * @return FuxQueryBuilder
     */
    public function queryBuilder()
    {
        $anchestors = $this->getAnchestorRelationships();
        $anchestors[] = $this;
        $qb = new FuxQueryBuilder();

        $baseInstance = $anchestors[0]->baseInstance;
        $baseInstanceData = $anchestors[0]->baseInstance->toArray();

        $qb->from($baseInstance::getTableName(), "t0");
        foreach ($baseInstance::getPrimaryKey() as $f) {
            if (isset($baseInstanceData[$f])) {
                $qb->where("t0.$f", $baseInstanceData[$f]);
            }
        }

        foreach ($anchestors as $i => $r) {

            //Add the list of selected field from the start relationship (if any)
            if ($r->getSelectableFields()) {
                $qb->selectAppend(array_map(function ($fieldName) use ($i) {
                    return "t" . ($i + 1) . ".$fieldName";
                }, $r->getSelectableFields()));
            }

            $onClause = [];
            foreach ($r->startModelFields as $j => $startModelField) {
                $endModelField = $r->endModelFields[$j];
                $onClause[] = "t$i.$startModelField = t" . ($i + 1) . ".$endModelField";
            }

            $qb->join($r->endModel::getTableName(), implode(" AND ", $onClause), "t" . ($i + 1));
        }

        //If the last anchestor has not custom fields list to be selected, we select the whole record
        $last = end($anchestors);
        if (!$last->getSelectableFields()) {
            $qb->selectAppend("t" . (count($anchestors)) . ".*");
        }

        return $qb;
    }


    /**
     * Perform a select query resolving the whole anchestor relationships in a multi-join select query
     *
     * @param string | Model $as If set an instance of $as::class will be returned
     * @param callable | null $qbModifier A function that returns a modified version of the query builder used to resolve relationship
     *
     * @return Model | null
     */
    public function get($as = null, callable $qbModifier = null)
    {
        $qb = $this->queryBuilder();
        if ($qbModifier) $qb = call_user_func($qbModifier, $qb);
        $v = $qb->first();

        if (!$v) return null;
        if ($as) {
            return new $as($v);
        }
        return new Model($v);
    }


    /**
     * Perform a select query resolving the whole anchestor relationships in a multi-join select query. Used for
     * one to many or many to many relationships
     *
     * @param string | Model $as If set a collection of instance of $as::class will be returned
     * @param callable | null $qbModifier A function that returns a modified version of the query builder used to resolve relationship
     *
     * @return ModelCollection | null
     */
    public function all($as = null, callable $qbModifier = null)
    {
        $qb = $this->queryBuilder();
        if ($qbModifier) $qb = call_user_func($qbModifier, $qb);
        $data = $qb->execute();
        foreach ($data as &$d) {
            $d = $as ? new $as($d) : new Model($d);
        }
        return new ModelCollection($data);
    }

    /**
     * Return a plain SQL select query resolving the whole anchestor relationships in a multi-join select query
     *
     * @return string
     */
    public function toQuery()
    {
        return $this->queryBuilder()->result();
    }


    /**
     * The aim of this magic methods is to intercepts all "chainable" actions over model relationships. For exaple it
     * could be possible to run something like the following:
     *
     * $user = UserModel::get(1234)->referral()->orders()->get();
     *
     * where "->referral()" and "->orders()" both return a "Relationship" instance. Since the call to "->orders()" is
     * not really possible on a Relationship object, the use of __call() magic methods can handle this kind of situation.
     * This method will return a new Relationship object by instantiating a new temporary instance of the "endModel"
     * and calling the "->orders()" method on it.
     *
     * @param string $name The method of the endModel that return a relationship object
     *
     * @throws \Exception
     */
    public function __call($name, $arguments)
    {
        $endModelInstance = new $this->endModel([/* no real fields are set */]);
        $relationship = $endModelInstance->{$name}();
        if ($relationship instanceof Relationship) {
            $relationship->setParentRelationship($this);
            return $relationship;
        }
        throw new \Exception("The method $this->endModel::$name does not return a Relationship object");
    }


    /**
     * Return a complete list of all anchestor relationships. For each i-th element with i > 0 the following statement
     * holds:
     *
     * anchestor[i]->endModel == anchestor[i+1]->startModel AND
     * anchestor[i-1]->endModel === anchestor[i]->startModel
     *
     * @return Relationship[]
     */
    private function getAnchestorRelationships()
    {
        $anchestors = [];
        if ($this->parentRelationship) {
            $anchestors = $this->parentRelationship->getAnchestorRelationships();
            $anchestors[] = $this->parentRelationship;
        }
        return $anchestors;
    }

    /**
     * @return mixed
     */
    public function getParentRelationship()
    {
        return $this->parentRelationship;
    }

    /**
     * @param Relationship $parentRelationship
     */
    public function setParentRelationship($parentRelationship): void
    {
        $this->parentRelationship = $parentRelationship;
    }

    public function ref(&$var)
    {
        $var = "t" . (count($this->getAnchestorRelationships()) + 1);
        return $this;
    }

    /**
     * Adds a new property with name $key to the "base" instance of the relationship chain. This new property will contain
     * the result of the database fetching based on relationship settings.
     *
     * @param string $key The name of the new property that will be created
     * @param bool $hasMore Weather the expand action could return multiple records of the "end model"
     * @param callable | null $qbModifier A function that returns a modified version of the query builder used to resolve relationship
     *
     * @return Model | ModelCollection | null
     */
    public function expand(string $key, bool $hasMore = false, callable $qbModifier = null): ModelCollection|Model|null
    {

        $anchestors = $this->getAnchestorRelationships();
        $baseInstance = $anchestors[0]->baseInstance ?? $this->baseInstance;

        if ($hasMore) {
            $results = $this->all($this->endModel, $qbModifier);
            $baseInstance->{$key} = $results;
        } else {
            $baseInstance->{$key} = $this->get($this->endModel, $qbModifier);
        }
        return $baseInstance->{$key};
    }
}
