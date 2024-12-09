<?php

namespace Fux\Database\Model;

use Exception;
use Fux\DB;
use Fux\Exceptions\FuxException;
use Fux\FuxDataModel;
use SqlWhere;
use Traversable;

class Model implements \JsonSerializable, \ArrayAccess, \IteratorAggregate
{

    use ModelCacheTrait;

    protected static $tableName = 'default_table';
    protected static $tableFields = ['id'];
    protected static $primaryKey = ['id'];
    protected static $saveModes = [];
    /** @property Relationship[] $relationships */
    protected static $relationships = [];
    protected $data = [];

    public function __construct($data = [])
    {
        if (static::class != Model::class) {
            $this->data = array_intersect_key($data, array_flip(static::$tableFields));
        } else {
            $this->data = $data;
        }
    }

    public function __get($name)
    {
        return $this->data[$name];
    }

    public function __set($name, $value)
    {
        $this->data[$name] = $value;
        return $this;
    }

    public function __isset($name)
    {
        return isset($this->data[$name]);
    }

    public function __unset($name)
    {
        unset($this->data[$name]);
    }

    /**
     * Overwrite the model that with a new key-value pairs. All the field names that does not belongs to the
     * model will be ignored and all field names which are not included in the new key-value pairs will remain the same
     *
     * @param array $data
     *
     * @return self
     */
    public function overwrite($data)
    {
        $data = array_intersect_key($data, array_flip(static::$tableFields));
        $this->data = array_merge($this->data, $data);
        return $this;
    }

    /**
     * Check whether tha passed instance primary key and the current model primary key match
     *
     * @param Model $model
     *
     * @return bool
     */
    public function is($model)
    {
        return $model->getPrimaryKeyValue() == $this->getPrimaryKeyValue();
    }

    public function toArray()
    {
        return $this->data;
    }

    public function commit($sanitize = true, $ignoreNullData = true)
    {
        $data = $this->data;
        if ($sanitize) sanitize_object($data);
        return self::save($data, $ignoreNullData);
    }

    /**
     * Delete the record in the table represented by the current instance primary key values
     *
     * @return bool
     */
    public function deleteSelf()
    {
        return self::delete($this->getPrimaryKeyValue());
    }

    /**
     * Create a clone of the current model instance, returning a new PHP object
     *
     * @param bool $resetPrimaryKeys
     *
     * @return static
     */
    public function mock($resetPrimaryKeys = true)
    {
        $data = $resetPrimaryKeys ? array_diff_key($this->data, array_flip($this::getPrimaryKey())) : $this->data;
        return new static($data);
    }

    public function refetch()
    {
        $newData = self::get($this->getPrimaryKeyValue());
        $this->overwrite($newData->toArray());
        return $this;
    }


    public function relationship($on, $to, $over)
    {
        return new Relationship(static::class, $on, $to, $over, $this);
    }


    /**
     * Return an associative array representing the primary key of the model
     */
    public function getPrimaryKeyValue()
    {
        return array_intersect_key($this->data, array_flip(static::getPrimaryKey()));
    }


    /**
     * Return an "empty" instance of the model (all fields are set at NULL value)
     *
     * @return static
     */
    public static function makeEmpty()
    {
        return new static(array_fill_keys(static::$tableFields, null));
    }

    /**
     * Get the table name of the current model
     *
     * @return string
     */
    public static function getTableName()
    {
        return static::$tableName;
    }


    /**
     * Get the table fields of the current model
     *
     * @return string[]
     */
    public static function getTableFields()
    {
        return static::$tableFields;
    }


    /**
     * Get the primary key of the current model
     *
     * @return string[]
     */
    public static function getPrimaryKey()
    {
        return static::$primaryKey;
    }


    /**
     * Get all the possible save modes names of the current model
     *
     * @return string[]
     */
    public static function getSaveModes()
    {
        return static::$saveModes;
    }


    /**
     * Return an instance of the query builder to be able to execute queries on the current table
     *
     * @return \Fux\FuxQueryBuilder
     */
    public static function queryBuilder()
    {
        return (new \Fux\FuxQueryBuilder())->select(static::$tableFields)->from(static::$tableName);
    }


    /**
     * Return a single record from DB by its primary key value
     *
     * @param array | mixed $pk_value = [
     *     "pk_field1" => "value",
     *     //...
     *     "pk_fieldN" => "valueN"
     * ]
     * @param string[] $neededFields The fields that have to be selected
     *
     * @return static | null
     */
    public static function get($pk_value, $neededFields = null, $forUpdate = false, $useCache = false)
    {
        if (!is_array($pk_value)) $pk_value = [static::$primaryKey[0] => $pk_value];

        if ($useCache) {
            $cachedRow = static::getFromCache($pk_value);
            if ($cachedRow) return $cachedRow;
        }

        $qb = self::queryBuilder();
        if ($neededFields) $qb->select($neededFields);

        foreach ($pk_value as $f => $v) {
            if (in_array($f, static::$primaryKey)) {
                $qb->where($f, $v);
            }
        }

        $qb->forUpdate($forUpdate);

        $row = $qb->first();
        if (!$row) return null;
        $instance = new static($row);
        if ($useCache) $instance->addToCache();
        return $instance;
    }


    /**
     * Return a single record from DB by its primary key value
     *
     * @param array | mixed $pk_value = [
     *     "pk_field1" => "value",
     *     //...
     *     "pk_fieldN" => "valueN"
     * ]
     * @param string[] $neededFields The fields that have to be selected
     *
     * @return static | null
     *
     * @deprecated Use "get" method instead
     */
    public static function getRecord($pk_value, $neededFields = null)
    {
        return self::get($pk_value, $neededFields);
    }


    /**
     * Return a single record from Database by where condition
     *
     * @param string | SqlWhere | array $where Where condition to apply to the query, if it is an associative array it represent
     * a field:value list that will "ANDed" toghether as equality condition
     * (e.g. `[...] WHERE field1 = "value1" AND fieldN = "valueN"`)
     * @param string[] $neededFields The fields that have to be selected
     *
     * @return static | null
     */
    public static function getWhere($where, $neededFields = null)
    {
        $qb = self::queryBuilder();
        if ($neededFields) $qb->select($neededFields);

        if ($where instanceof SqlWhere) {
            $where = (string)$where;
            $qb->SQLWhere($where);
        } elseif (is_array($where)) {
            $qb->massiveWhere($where);
        } else {
            $qb->SQLWhere($where);
        }

        $row = $qb->first();
        return $row ? new static($row) : null;
    }


    /**
     * Return a list of model instances
     *
     * @param string[] $neededFields The fields that have to be selected
     *
     * @return ModelCollection
     */
    public static function listRecords($neededFields = null)
    {
        $qb = self::queryBuilder();
        if ($neededFields) $qb->select($neededFields);

        $rows = $qb->execute();
        if (!$rows) return new ModelCollection([]);

        $list = [];
        foreach ($rows as $r) {
            $list[] = new static($r);
        }
        return new ModelCollection($list);
    }


    /**
     * Return a list of model instances by where condition
     *
     * @param string | SqlWhere | array $where Where condition to apply to the query, if it is an associative array it represent
     * a field:value list that will "ANDed" toghether as equality condition
     * (e.g. `[...] WHERE field1 = "value1" AND fieldN = "valueN"`)
     *
     * @param string[] $neededFields The fields that have to be selected
     *
     * @return ModelCollection | static[]
     */
    public static function listWhere($where, $neededFields = null)
    {
        $qb = self::queryBuilder();
        if ($neededFields) $qb->select($neededFields);

        if ($where instanceof SqlWhere) {
            $where = (string)$where;
            $qb->SQLWhere($where);
        } elseif (is_array($where)) {
            $qb->massiveWhere($where);
        } else {
            $qb->SQLWhere($where);
        }

        $rows = $qb->execute();
        if (!$rows) return new ModelCollection([]);

        $list = [];
        foreach ($rows as $r) {
            $list[] = new static($r);
        }
        if (!$list) return null;
        return new ModelCollection($list);
    }


    /**
     * Delete a record from DB
     *
     * @param array | mixed $primaryKey = [
     *     "pk_field1" => "value",
     *     //...
     *     "pk_fieldN" => "valueN"
     * ]
     *
     * @return bool
     * @throws Exception
     */
    public static function delete($primaryKey)
    {
        $qb = self::queryBuilder();
        $qb->delete(static::$tableName);

        if (!is_array($primaryKey)) $primaryKey = [static::$primaryKey[0] => $primaryKey];
        $primaryKey = array_intersect_key($primaryKey, array_flip(static::$primaryKey));
        if (!$primaryKey) throw new Exception("The primary key passed is empty or not valid");
        foreach ($primaryKey as $f => $v) $qb->where($f, $v);

        $qb->execute() or die(DB::ref()->error . $qb->result());
        return DB::ref()->affected_rows || DB::ref()->errno == 0;
    }


    /**
     * Delete a record from DB by where condition
     *
     * @param string | SqlWhere | array $where Where condition to apply to the query, if it is an associative array it represent
     * a field:value list that will "ANDed" toghether as equality condition
     * (e.g. `[...] WHERE field1 = "value1" AND fieldN = "valueN"`)
     *
     * @return bool
     */
    public static function deleteWhere($where)
    {
        $qb = self::queryBuilder();
        $qb->delete(static::$tableName);

        if ($where instanceof SqlWhere) {
            $where = (string)$where;
            $qb->SQLWhere($where);
        } elseif (is_array($where)) {
            $qb->massiveWhere($where);
        } else {
            $qb->SQLWhere($where);
        }

        $qb->execute() or die(DB::ref()->error . $qb->result());
        return DB::ref()->affected_rows || DB::ref()->errno == 0;
    }

    /**
     * Make an update of records which match where conditions
     *
     * @param array $data = [
     *     "field1" => "value",
     *     //...
     *     "fieldN" => "valueN"
     * ]
     * @param string | SqlWhere | array $where Where condition to apply to the query, if it is an associative array it represent
     * a field:value list that will "ANDed" toghether as equality condition
     * (e.g. `[...] WHERE field1 = "value1" AND fieldN = "valueN"`)
     * @param bool $ignoreNullData wheather to skip null values passed in data
     *
     * @return bool
     */
    public static function saveWhere($data, $where, $ignoreNullData = true)
    {
        if ($ignoreNullData) {
            foreach ($data as $field => $value) {
                if ($value === null) {
                    unset($data[$field]);
                }
            }
        }

        $qb = self::queryBuilder();

        if ($where instanceof SqlWhere) {
            $where = (string)$where;
            $qb->SQLWhere($where);
        } elseif (is_array($where)) {
            $qb->massiveWhere($where);
        } else {
            $qb->SQLWhere($where);
        }

        $qb->update(static::$tableName)
            ->massiveSet($data)
            ->execute() or die(DB::ref()->error . $qb->result());

        return DB::ref()->affected_rows || DB::ref()->errno == 0;
    }


    /**
     * This function perform an update of the record identified by the primary key fields passed in the $data param (if
     * any); otherwise it perform an insert statement.
     *
     * @param array $data = [
     *     "field1" => "value",
     *     //...
     *     "fieldN" => "valueN"
     * ]
     * @param bool $ignoreNullData wheather to skip null values passed in data
     * @param bool $ignoreClause wheather to use the IGNORE clause in the insert statement
     * @param string $saveMode the save mode name to use
     *
     * @return mixed This function return different values based on the type of statement performed:
     * - FALSE if the statement failed for whatever reason
     * - The primary key of the updated record if the complete primary key has been passed and the update has been
     * successful
     * - The primary key of the inserted record if using auto increment primary key
     * - TRUE if the statement has been executed successfully and no one of the previuous cases has been encountered
     */
    public static function save($data, $ignoreNullData = true, $ignoreClause = false, $saveMode = null)
    {

        if ($data instanceof FuxDataModel) $data = $data->toArray();

        if ($ignoreNullData) {
            foreach ($data as $field => $value) {
                if ($value === null) {
                    unset($data[$field]);
                }
            }
        }
        //Remove all unmanaged fields
        $data = array_intersect_key($data, array_flip(static::$tableFields));

        //Remove all fields not included in the specified save mode
        if ($saveMode && isset(static::$saveModes[$saveMode])) {
            $data = array_intersect_key($data, array_flip(static::$saveModes[$saveMode]));
        }

        $primaryKey = array_filter($data, function ($field) {
            return in_array($field, static::$primaryKey);
        }, ARRAY_FILTER_USE_KEY);
        $isPrimarySet = count($primaryKey) === count(static::$primaryKey);
        $isRecordExisting = $isPrimarySet && !!self::get($data);

        if ($isRecordExisting) {
            return self::saveWhere($data, $primaryKey, $ignoreNullData) ? reset($primaryKey) : false;
        } else {
            $qb = self::queryBuilder();
            $qb->insert(static::$tableName, $ignoreClause)->massiveValues($data)->execute() or die(DB::ref()->error . "SQL:" . $qb->result());
            $id = DB::ref()->insert_id;
            $querySuccess = DB::ref()->affected_rows || DB::ref()->errno == 0;
            if ($querySuccess && $id) return $id;
            if ($querySuccess) return true;
        }

        return false;
    }


    /**
     * Return the value of the aggregated field name
     *
     * @param string $aggregateFunction : AVG, SUM, COUNT, etc...
     * @param string $aggregateFieldName : A field name that was passed with setTableFields
     * @param array | SqlWhere | string $where : A where condition to apply to the query
     *
     * @return mixed
     */
    public static function getAggregateWhere(string $aggregateFunction, string $aggregateFieldName, $where = '1')
    {
        $qb = self::queryBuilder();
        $qb->select("$aggregateFunction($aggregateFieldName) as $aggregateFieldName");

        if ($where instanceof SqlWhere) {
            $where = (string)$where;
            $qb->SQLWhere($where);
        } elseif (is_array($where)) {
            $qb->massiveWhere($where);
        } else {
            $qb->SQLWhere($where);
        }

        $data = $qb->first();
        return $data[$aggregateFieldName] ?? null;
    }


    /**
     * Return a list of query result set, composed by the aggregated field name and the group's clause fields
     *
     * @param string $aggregateFunction : AVG, SUM, COUNT, etc...
     * @param string $aggregateFieldName : A field name that was passed with setTableFields
     * @param string | string[] $groupFieldName : A field name (or array) that will be used to group the results
     * @param array | SqlWhere | string $where : A string that rapresent the WHERE clause
     *
     * @return mixed
     */
    public static function listAggregateGroupsWhere(string $aggregateFunction, string $aggregateFieldName, $groupFieldName, $where = '1')
    {
        if (!is_array($groupFieldName)) $groupFieldName = [$groupFieldName];
        $qb = self::queryBuilder();
        $qb->select($groupFieldName)->selectAppend("$aggregateFunction($aggregateFieldName) as $aggregateFieldName");

        if ($where instanceof SqlWhere) {
            $where = (string)$where;
            $qb->SQLWhere($where);
        } elseif (is_array($where)) {
            $qb->massiveWhere($where);
        } else {
            $qb->SQLWhere($where);
        }

        $qb->groupBy(...$groupFieldName);

        return new ModelCollection($qb->execute());
    }


    /**
     * Remove all fields from the model that are not in the given list
     *
     * @param string[] $allowedFields A list of allowed fields to keep in the model instance
     *
     * @return static
     */
    public function filterFields($allowedFields = [])
    {
        $this->data = array_intersect_key($this->data, array_flip($allowedFields));
        return $this;
    }


    /**
     * Remove all fields in the model that are in the given list
     *
     * @param string[] $fields A list of fields to remove from the model instance
     *
     * @return static
     */
    public function dropFields($fields = [])
    {
        $remainingFields = array_diff(static::$tableFields, $fields);
        $this->data = array_intersect_key($this->data, array_flip($remainingFields));
        return $this;
    }


    /**
     * @return mixed
     */
    public function jsonSerialize(): mixed
    {
        return $this->data;
    }

    /**
     * @return mixed
     */
    public function __toString()
    {
        return json_encode($this);
    }

    public function offsetExists($offset): bool
    {
        return isset($this->data[$offset]);
    }

    public function offsetGet($offset): mixed
    {
        return $this->data[$offset];
    }

    public function offsetSet($offset, $value): void
    {
        $this->data[$offset] = $value;
    }

    public function offsetUnset($offset): void
    {
        unset($this->data[$offset]);
    }

    public function getIterator(): Traversable
    {
        return new \ArrayIterator($this->data);
    }
}
