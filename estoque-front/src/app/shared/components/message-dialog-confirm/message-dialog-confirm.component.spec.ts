import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MessageDialogConfirmComponent } from './message-dialog-confirm.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('MessageDialogConfirmComponent', () => {
  let component: MessageDialogConfirmComponent;
  let fixture: ComponentFixture<MessageDialogConfirmComponent>;

  const mockMessage = 'Tem certeza que deseja continuar?';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDialogConfirmComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockMessage },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageDialogConfirmComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the message via MAT_DIALOG_DATA', () => {
    expect(component.msg).toBe(mockMessage);
  });
});
