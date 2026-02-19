import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageService, TreeNode} from 'primeng/api';
import {DragDropModule} from 'primeng/dragdrop';

import {OrgChartService} from "../../services/orgchart.service";
import {OrgChartNode} from "../../models/orgchartNode.model";
import {OrgNodeComponent} from "./org-node.component";
import {Fluid} from "primeng/fluid";
import {DocumentService} from "../../services/document.service";
import {ToastMessagesComponent} from "../../conponents/toast-messages/toast-messages.component";
import {InputText} from "primeng/inputtext";

@Component({
    selector: 'app-org-chart',
    standalone: true,
    imports: [CommonModule, DragDropModule, OrgNodeComponent, Fluid, ToastMessagesComponent, InputText],
    templateUrl: './org-chart.component.html',
    providers: [MessageService]
})
export class OrgChartComponent implements OnInit {
    private orgService: OrgChartService = inject(OrgChartService);
    private readonly messageService: MessageService = inject(MessageService);

    nodes = signal<TreeNode[]>([]);

    unassignedList = signal<OrgChartNode[]>([]);

    draggedEmployee: OrgChartNode | null = null;

    ngOnInit() {
        this.loadBoard();
    }

    loadBoard() {
        this.orgService.getRoots().subscribe(res => {
            this.nodes.set(res.map(n => this.mapToTreeNode(n)));
        });

        this.orgService.getUnassignedEmployees().subscribe(res => {
            this.unassignedList.set(res);
        });
    }

    // เมื่อเริ่มลากพนักงานจากฝั่งซ้าย
    onDragUnassigned(emp: OrgChartNode) {
        this.draggedEmployee = emp;
    }

    onDragEnd() {
        this.draggedEmployee = null;
    }

    // เมื่อปล่อยพนักงานลงในกล่องตำแหน่งใดๆ ฝั่งขวา (เรียกจาก OrgNodeComponent ลูก)
    dropToPosition(targetManagerId: string) {
        if (this.draggedEmployee) {
            const empId: string = this.draggedEmployee.id;

            // ป้องกันการลากพนักงานไปวางทับตัวเอง
            if (empId === targetManagerId) {
                this.draggedEmployee = null;
                return;
            }

            this.orgService.moveEmployee(empId, targetManagerId).subscribe({
                next: () => {
                    this.draggedEmployee = null;
                    this.loadBoard();
                },
                error: (err) => {
                    // alert(err.error);
                    console.error('moveEmployee', err);
                    this.messageService.add({ severity: 'error', summary: `Error ${err.status}`, detail: err.statusText });
                    this.draggedEmployee = null;
                }
            });
        }
    }

    // เมื่อปล่อยพนักงานลงฝั่งซ้าย (ปลดตำแหน่ง)
    dropToUnassigned() {
        if (this.draggedEmployee) {
            const empId = this.draggedEmployee.id;

            // ถ้าพนักงานคนนั้นอยู่ฝั่งซ้ายอยู่แล้ว (ไม่มีตำแหน่ง) ไม่ต้องยิง API ให้เปลือง
            if (this.unassignedList().find(e => e.id === empId)) {
                this.draggedEmployee = null;
                return;
            }

            this.orgService.unassignEmployee(empId).subscribe({
                next: () => {
                    this.draggedEmployee = null;
                    this.loadBoard(); // โหลดข้อมูลซ้ายขวาใหม่
                },
                error: (err) => {
                    // alert("Transaction Failed: " + (err.error || err.message || err));
                    console.error('unassignEmployee', err);
                    this.messageService.add({ severity: 'error', summary: `Error ${err.status}`, detail: err.statusText });
                    this.draggedEmployee = null;
                }
            });
        }
    }

    private mapToTreeNode(n: OrgChartNode): TreeNode {
        return {
            label: n.name,
            data: n,
            children: n.children ? n.children.map(c => this.mapToTreeNode(c)) : []
        };
    }

    searchQuery = signal<string>(''); // เก็บคำค้นหา

    filteredUnassignedList = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return this.unassignedList();
        debugger;
        return this.unassignedList().filter(emp =>
            emp.name?.toLowerCase().includes(query) ||
            emp.code?.toLowerCase().includes(query)
        );
    });

    // ฟังก์ชันรับค่าจากช่อง Search
    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value);
    }
}