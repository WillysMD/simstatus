import {Sort} from '@angular/material';

export function sortByOptions(array: Array<any>, sort: Sort): void {
  const col = sort.active;
  const isAsc = sort.direction === 'asc';

  array.sort((a, b) => {
    return (a[col] < b[col] ? -1 : 1) * (isAsc ? 1 : -1);
  });
}
