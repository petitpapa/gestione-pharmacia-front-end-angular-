import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatByte',
  pure: false
})
export class FormatBytePipe implements PipeTransform {

  transform(bytes: number, decimals: number): string {
    return this.formatBytes(bytes, decimals);
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
