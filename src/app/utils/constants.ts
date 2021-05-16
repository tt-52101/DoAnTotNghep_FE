// Lưu các tham số dùng chung
import { QueryFilerModel } from '@model';

export const ROLE_SYS_ADMIN = 'SYS_ADMIN';
export const LAPTOP_ID = '14843a87-3a07-4dd1-9171-0dc0f56ff0fc';
export const PC_GM = '4f5e44ec-53a3-4536-b8e3-f673191a3638';
export const GM_GEAR = 'ee4a2a91-6416-46ae-928c-ec31ba9bbbd2';
export const LIST_STATUS = [
  { id: true, code: true, name: 'Hoạt động' },
  { id: false, code: false, name: 'Không hoạt động' },
];

export const LIST_STATUS_ORDER = [
  { id: -1, name: 'Đã hủy' },
  { id: 0, name: 'Chờ xác nhận' },
  { id: 1, name: 'Đang lấy hàng' },
  { id: 2, name: 'Đang giao hàng' },
  { id: 3, name: 'Đã giao hàng' },
];
export const QUERY_FILTER_DEFAULT: QueryFilerModel = {
  pageNumber: 1,
  pageSize: 20,
  textSearch: undefined,
};
export const reCaptchaKey = '6LejNL4aAAAAAJATFE7BD2CCxFN7vNvuohdOiONf';
export const PAGE_SIZE_OPTION_DEFAULT = [5, 10, 20, 50];

export const EXCEL_STYLES_DEFAULT = [
  {
    id: 'greenBackground',
    interior: {
      color: '#b5e6b5',
      pattern: 'Solid',
    },
  },
  {
    id: 'redFont',
    font: {
      fontName: 'Calibri Light',
      underline: 'Single',
      italic: true,
      color: '#ff0000',
    },
  },
  {
    id: 'darkGreyBackground',
    interior: {
      color: '#888888',
      pattern: 'Solid',
    },
    font: {
      fontName: 'Calibri Light',
      color: '#ffffff',
    },
  },
  {
    id: 'boldBorders',
    borders: {
      borderBottom: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
      borderLeft: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
      borderRight: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
      borderTop: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3,
      },
    },
  },
  {
    id: 'header',
    interior: {
      color: '#CCCCCC',
      pattern: 'Solid',
    },
    alignment: {
      vertical: 'Center',
      horizontal: 'Center',
    },
    font: {
      bold: true,
      fontName: 'Calibri',
    },
    borders: {
      borderBottom: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderLeft: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderRight: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderTop: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1,
      },
    },
  },
  {
    id: 'dateFormat',
    dataType: 'dateTime',
    numberFormat: { format: 'mm/dd/yyyy;@' },
  },
  {
    id: 'twoDecimalPlaces',
    numberFormat: { format: '#,##0.00' },
  },
  {
    id: 'textFormat',
    dataType: 'string',
  },
  {
    id: 'bigHeader',
    font: { size: 25 },
  },
];
export const OVERLAY_LOADING_TEMPLATE = '<span class="ag-overlay-loading-center">Đang tải dữ liệu, vui lòng chờ!</span>';
export const OVERLAY_NOROW_TEMPLATE =
  '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Không có dữ liệu!</span>';
