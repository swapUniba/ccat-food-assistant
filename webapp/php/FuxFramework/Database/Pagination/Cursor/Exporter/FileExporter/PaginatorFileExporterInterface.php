<?php

namespace Fux\Database\Pagination\Cursor\Exporter\FileExporter;

interface PaginatorFileExporterInterface
{

    public function __construct($filePath);

    public function appendRow($row): bool;

    public function setHeaders($headers): bool;

    public function close();

}