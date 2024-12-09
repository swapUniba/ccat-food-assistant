<?php

namespace Fux\Database\Pagination\Cursor\Exporter\FileExporter;

class CsvFilePaginatorExporter implements PaginatorFileExporterInterface
{

    private $fd;

    public function __construct($filePath)
    {
        $this->fd = fopen($filePath, 'w');
    }

    public function appendRow($row): bool
    {
        return fputcsv($this->fd, $row);
    }

    public function close()
    {
        fclose($this->fd);
    }

    public function setHeaders($headers): bool
    {
        return fputcsv($this->fd, $headers);
    }
}