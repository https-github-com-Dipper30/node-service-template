import { Custom } from '@/types';

export default class BaseController {
  defaultPager: Custom.Pagination = { page: 1, size: 20 };
  constructor() {
    //
  }
}
