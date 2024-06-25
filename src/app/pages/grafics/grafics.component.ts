import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { GraphicOneComponent } from '../../components/graphics/graphic-one/graphic-one.component';
import { GraphicTwoComponent } from '../../components/graphics/graphic-two/graphic-two.component';
import { CommonModule } from '@angular/common';
import { GraphicsService } from '../../services/graphics.service';
import { Graphic } from '../../models/graphic';

@Component({
  selector: 'app-grafics',
  standalone: true,
  imports: [GraphicOneComponent, GraphicTwoComponent, CommonModule],
  templateUrl: './grafics.component.html',
  styleUrls: ['./grafics.component.scss'],
})
export class GraficsComponent implements OnInit {
  public graphicService = inject(GraphicsService);
  public graphic = signal<Graphic | null>(null);
  public graphicSelected: string = 'line';

  constructor() {}

  ngOnInit(): void {
    this.onGetGraphic({ type: 'bar' });
  }

  onGetGraphic(query: any) {
    this.graphicService.getGraphics(query).subscribe({
      next: (res) => {
        console.log({ res });
        this.graphic.set(res.graphics[0]);
      },
      error: (err) => console.log(err),
    });
  }
}
