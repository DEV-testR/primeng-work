import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'yesNo'
})
export class YesNoPipe implements PipeTransform {

    // 0 = No, 1 = Yes
    transform(value: number | boolean): string {
        if (typeof (value) === 'boolean') {
            return value ? 'Yes' : 'No';
        } else {
            if (value && (value === 1)) {
                return 'Yes';
            } else {
                return 'No';
            }
        }

    }
}
