import { Component, ElementRef, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './calendar-modal.component.html',
  styleUrl: './calendar-modal.component.scss',
})
export class CalendarModalComponent {
  @Input() onHideModal!: () => void;
  @Input() onUpdateEvent!: (event: any) => void;
  @Input() title!: FormControl;
  @Input() editModal!: ElementRef;
}
