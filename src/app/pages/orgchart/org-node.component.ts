import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeNode } from 'primeng/api';
import {OrgChartComponent} from "./org-chart.component";

@Component({
  selector: 'app-org-node',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './org-node.component.html',
})
export class OrgNodeComponent {
  @Input() node!: TreeNode;
  private parent: OrgChartComponent = inject(OrgChartComponent);

  onDragStart() {
    // แก้จาก draggedNode เป็น draggedEmployee ให้ตรงกับตัวแม่
    this.parent.draggedEmployee = this.node.data;
  }

  onDrop() {
    // ตรวจสอบว่า targetManagerId ส่งเป็น string ตาม Model ใหม่
    this.parent.dropToPosition(this.node.data.id);
  }
}