<?php

namespace Fux\Database\Pagination\Cursor\Exporter\FileExporter;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelFilePaginatorExporter implements PaginatorFileExporterInterface
{

    private Spreadsheet $spreadsheet;
    private $filePath;
    private $nextRowNum = 1;
    private $headers;

    public function __construct($filePath)
    {
        $this->filePath = $filePath;
        $this->spreadsheet = new Spreadsheet();
    }

    public function appendRow($row): bool
    {
        if (!$this->setRow($this->nextRowNum, $row)) return false;
        $this->nextRowNum++;
        return true;
    }

    public function setRow($rowIdx, $row): bool
    {
        if (!$this->headers) throw new \Exception("You cannot add rows if you didn't add any headers first");

        foreach ($this->headers as $colNum => $colName) {
            $this->setCellValue($rowIdx, $colNum + 1, $row[$colName] ?? '');
        }

        return true;
    }

    public function setCellValue($rowIdx, $colIdx, $value): void
    {
        $this->spreadsheet->getActiveSheet()->setCellValue([$colIdx, $rowIdx], $value);
        $this->spreadsheet->getActiveSheet()->getColumnDimensionByColumn($colIdx)->setAutoSize(true);
    }

    public function close()
    {
        $writer = new Xlsx($this->spreadsheet);
        $writer->save($this->filePath);
    }

    public function setHeaders($headers): bool
    {
        $this->headers = $headers;
        foreach ($headers as $colNum => $v) {
            $this->setCellValue($this->nextRowNum, $colNum + 1, $v);
        }
        $this->nextRowNum++;
        return true;
    }

    public function getNextRowNum(): int
    {
        return $this->nextRowNum;
    }

    public function setNextRowNum(int $nextRowNum): void
    {
        $this->nextRowNum = $nextRowNum;
    }

    public function getSpreadsheet(): Spreadsheet
    {
        return $this->spreadsheet;
    }
}
