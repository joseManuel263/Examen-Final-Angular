import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'Fecha no disponible';

    const date = moment(value);
    const now = moment();
    const minutesAgo = now.diff(date, 'minutes');
    const hoursAgo = now.diff(date, 'hours');
    const daysAgo = now.diff(date, 'days');

    if (minutesAgo < 60) {
      return `Hace ${minutesAgo} ${minutesAgo === 1 ? 'minuto' : 'minutos'}`;
    } else if (hoursAgo < 24) {
      return `Hace ${hoursAgo} ${hoursAgo === 1 ? 'hora' : 'horas'}`;
    } else if (daysAgo === 1) {
      return 'Ayer';
    } else {
      return `Hace ${daysAgo} ${daysAgo === 1 ? 'día' : 'días'}`;
    }
  }
}
