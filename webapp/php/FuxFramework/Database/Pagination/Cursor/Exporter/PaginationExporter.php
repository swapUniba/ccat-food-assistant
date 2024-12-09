<?php

namespace Fux\Database\Pagination\Cursor\Exporter;

use Fux\Database\Pagination\Cursor\Exporter\FileExporter\CsvFilePaginatorExporter;
use Fux\Database\Pagination\Cursor\Exporter\FileExporter\ExcelFilePaginatorExporter;
use Fux\Database\Pagination\Cursor\Pagination;
use Fux\Exceptions\FuxException;
use Fux\FuxQueryBuilder;

class PaginationExporter
{

    const FILE_TYPE_CSV = 'csv';
    const FILE_TYPE_XLSX = 'xlsx';
    const MAX_QUERY_ROWS = 100;

    public function __construct(private FuxQueryBuilder $queryBuilder, private array $cursorFields, private string $sortType = 'ASC', private $onRowRender = null)
    {
    }

    public function exportAs($filePath, $fileType)
    {
        $exporter = match ($fileType) {
            self::FILE_TYPE_CSV => new CsvFilePaginatorExporter($filePath),
            self::FILE_TYPE_XLSX => new ExcelFilePaginatorExporter($filePath),
            default => throw new FuxException(false, "Invalid file type")
        };

        $pagination = new Pagination(
            $this->queryBuilder,
            $this->cursorFields,
            self::MAX_QUERY_ROWS,
            $this->sortType
        );

        $items = null;
        $nextCursor = null;
        $headers = null;

        while ($items === null || count($items) > 0) {
            $page = $pagination->get($nextCursor);
            $items = $page->getItems();
            foreach ($items as $i) {
                $fileRowData = isset($this->onRowRender) ? call_user_func($this->onRowRender, $i) : $i;
                if ($headers === null) {
                    $headers = array_keys($fileRowData);
                    $exporter->setHeaders($headers);
                }
                $exporter->appendRow($fileRowData);
            }
            $nextCursor = $page->getNextCursor();
            if (!$nextCursor) break;
        }

        $exporter->close();
        return true;
    }

}