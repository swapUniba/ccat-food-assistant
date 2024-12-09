<?php

namespace Fux\Database\Model;

class ModelCollection implements \Countable, \IteratorAggregate, \JsonSerializable, \ArrayAccess
{

    /** @property Model[] $data */
    private $data = [];

    /**
     * Create a collection of model instances
     *
     * @param Model[] $data
     *
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Return a collection of model instances
     *
     * @return Model[]
     */
    public function getData()
    {
        return $this->data;
    }

    public function toArray()
    {
        return $this->getData();
    }


    /**
     * Append another collection to the current one
     *
     * @param ModelCollection | Model[] $collection
     */
    public function concat($collection)
    {
        if ($collection instanceof ModelCollection) {
            $this->data = array_merge($this->data, $collection->getData());
        } else {
            $this->data = array_merge($this->data, $collection);
        }
    }

    /**
     * Append an item to the current collection
     *
     * @param Model $item
     */
    public function append($item)
    {
        $this->data[] = $item;
    }


    /**
     * Tests whether all elements in the collection pass the test implemented by the provided
     * function.
     *
     * @param callable $test
     * <p>
     * The test function is called with the following arguments:
     * - element: The current model instance being processed in the array.
     * - index: The index of the current element being processed in the collection
     * - collection: The collection instance
     * </p>
     *
     * @return bool
     */
    public function every($test)
    {
        foreach ($this->data as $i => $m) {
            if (!$test($m, $i, $this)) return false;
        }
        return true;
    }


    /**
     * Set some columns data of all the instances in the collection to a static value from a starting index.
     *
     * @param array $data
     * @param int $start Start index (inclusive), default 0
     * @param int $end End index (exclusive), default count($this)
     *
     * @return self
     */
    public function fill($data, $start = 0, $end = null)
    {
        if ($end === null) $end = count($this);
        for ($i = $start; $i < $end; $i++) {
            $this->data[$i]->overwrite($data);
        }
        return $this;
    }


    /**
     * Return the first instance in the collection that pass the test implemented by the provided
     * function.
     *
     * @param callable $test
     * <p>
     * The test function is called with the following arguments:
     * - element: The current model instance being processed in the array.
     * - index: The index of the current element being processed in the collection
     * - collection: The collection instance
     * </p>
     *
     * @return Model | null
     */
    public function find($test)
    {
        foreach ($this->data as $i => $m) {
            if ($test($m, $i, $this)) return $m;
        }
        return null;
    }


    /**
     * Return the index of the first instance in the collection that pass the test implemented by the provided
     * function.
     *
     * @param callable $test
     * <p>
     * The test function is called with the following arguments:
     * - element: The current model instance being processed in the array.
     * - index: The index of the current element being processed in the collection
     * - collection: The collection instance
     * </p>
     *
     * @return int | null
     */
    public function findIndex($test)
    {
        foreach ($this->data as $i => $m) {
            if ($test($m, $i, $this)) return $i;
        }
        return null;
    }


    /**
     * Return whether exists an instance in the collection that pass the test implemented by the provided
     * function.
     *
     * @param callable $test
     * <p>
     * The test function is called with the following arguments:
     * - element: The current model instance being processed in the array.
     * - index: The index of the current element being processed in the collection
     * - collection: The collection instance
     * </p>
     *
     * @return bool
     */
    public function some($test)
    {
        return !!$this->find($test);
    }

    /**
     * Sort collection rows using a user-defined comparison function
     *
     * @param callable $callback <p>
     * The comparison function must return an integer less than, equal to, or
     * greater than zero if the first argument is considered to be
     * respectively less than, equal to, or greater than the second.
     * </p>
     *
     * @return self
     */
    public function sort($callback)
    {
        usort($this->data, $callback);
        return $this;
    }


    /**
     * Reverse the order of the instances in the collection
     *
     * @return self
     */
    public function reverse()
    {
        $this->data = array_reverse($this->data);
        return $this;
    }


    /**
     * Return a new collection composed by all instances  that pass the test implemented by the provided function
     *
     * @param callable $test
     * <p>
     * The test function is called with the following arguments:
     * - element: The current model instance being processed in the array.
     * - index: The index of the current element being processed in the collection
     * - collection: The collection instance
     * </p>
     *
     * @return ModelCollection
     */
    public function filter($test)
    {
        $items = array_values(array_filter($this->data, function ($m, $i) use ($test) {
            return $test($m, $i, $this);
        }, ARRAY_FILTER_USE_BOTH));
        return new ModelCollection($items);
    }


    /**
     * Return a new collection composed by all instances with primary key not matched with the ones passed. If partial
     * primary key are present either in except instances or collection instances the instance will be labeled as "correct"
     * and will belong to the output collection.
     *
     * @param Model[] $instances
     *
     * @return ModelCollection
     */
    public function except($instances)
    {
        $items = array_filter($this->data, function ($m) use ($instances) {
            foreach ($instances as $e) {
                if ($m->is($e)) return false;
            }
            return true;
        });
        return new ModelCollection($items);
    }


    /**
     * Apply array_reduce function to items in the collection
     *
     * @param callable $callback
     * Signature is <pre>callback ( mixed $carry , mixed $item ) : mixed</pre>
     * @param mixed $initial
     *
     * @return mixed
     */
    public function reduce($callback, $initial)
    {
        return array_reduce($this->data, $callback, $initial);
    }


    /**
     * Apply array_map function to items in the collection
     *
     * @param callable $callback
     *
     * @return array
     */
    public function map($callback)
    {
        return array_map($callback, $this->data);
    }


    /**
     * Apply a function to each item of the collection, the returned value of the callback will be used to replace the
     * item in the collection
     *
     * @param callable $callback
     *
     * @return self
     */
    public function apply($callback)
    {
        $this->data = array_map($callback, $this->data);
        return $this;
    }


    /**
     * Return an array where each i-th element is the value of the wanted column of the i-th element in the collection
     *
     * @param string $columnName
     *
     * @return array
     */
    public function column($columnName)
    {
        return array_map(fn($row) => $row[$columnName], $this->getData());
    }

    /**
     * Transform the collection into an associative array where each key is the value in the $keyField column and
     * each value is the value in the $valueField column
     *
     * @return array
     * @var string $valueField The field that contains the values of the associative array
     *
     * @var string $keyField The field that contains the keys of the associative array
     */
    public function assoc($keyField, $valueField)
    {
        return $this->reduce(function ($carry, $s) use ($keyField, $valueField) {
            $carry[$s[$keyField]] = $s[$valueField];
            return $carry;
        }, []);
    }

    public function isEmpty()
    {
        return count($this->data) == 0;
    }

    public function count(): int
    {
        return count($this->data);
    }

    public function getIterator(): \Traversable
    {
        return new \ArrayIterator($this->data);
    }

    public function jsonSerialize(): mixed
    {
        return $this->data;
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
}
