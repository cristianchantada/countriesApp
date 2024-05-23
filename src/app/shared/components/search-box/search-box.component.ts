import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit {

  private debouncer: Subject<string> = new Subject<string>();

  @Input()
  public placeholder: string = ''

  @ViewChild('txtInput')
  public capitalInput!: ElementRef<HTMLInputElement>;

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debouncer.pipe(
      debounceTime(300)
    )
    .subscribe( value =>{
      this.onDebounce.emit(value);
    })
  }

  emitValue(capital: string): void{
    this.onValue.emit(capital);
  }

  onKeyPress(searchTerm: string){
    this.debouncer.next(searchTerm);
  }

}
