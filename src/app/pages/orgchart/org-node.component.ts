import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeNode } from 'primeng/api';
import { OrgChartComponent } from "./org-chart.component";

@Component({
  selector: 'app-org-node',
  standalone: true,
  imports: [CommonModule, DragDropModule, NgOptimizedImage],
  templateUrl: './org-node.component.html',
})
export class OrgNodeComponent {
  @Input({ required: true }) node!: TreeNode;

  private parent = inject(OrgChartComponent);

  onDragStart(): void {
    if (this.node.data) {
      this.parent.draggedEmployee.set(this.node.data);
    }
  }

  onDrop(): void {
    if (this.node.data?.id) {
      this.parent.dropToPosition(this.node.data.id);
    }
  }
}