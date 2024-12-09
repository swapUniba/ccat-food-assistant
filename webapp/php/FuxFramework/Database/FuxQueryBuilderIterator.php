<?php

namespace Fux;


/**
 * Questa classe viene inizializzata con un query builder e permette di attraversare il poteziale result set
 * con il cambio interno dei parametri di limit e offset
*/
class FuxQueryBuilderIterator
{

    /** @property FuxQueryBuilder $builder */
    private $builder;
    private $offset;

    /**
     * @param FuxQueryBuilder $builder
     * @param int $initialOffset
    */
    public function __construct($builder, $initialOffset = 0){
        $this->builder = $builder;
        $this->offset = $initialOffset;
    }

    public function next($rowNum){
        $data = $this->builder->offset($this->offset)->limit($rowNum)->execute();
        $this->offset += $rowNum;
        return $data;
    }

    public function iterator($chunkSize = 10){
        $chunk = $this->next($chunkSize);
        while ($chunk) {
            foreach ($chunk as $item) {
                yield $item;
            }
            $chunk = $this->next($chunkSize);
        }
    }

    public function chunkIterator($chunkSize = 10){
        while (true){
            $chunk = $this->next($chunkSize);
            if ($chunk) yield $chunk;
            if (!$chunk) break;
        }
    }

    public function setOffset(int $offset): void {
        $this->offset = $offset;
    }

}
