import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy {

	private debouncer: Subject<string> = new Subject<string>();
	private debouncerSuscripcion?: Subscription;

	@Input()
	public placeholder: string = '';

	@Input()
	public initialValue:string = '';

	@ViewChild('txtInput')
	public capitalInput!: ElementRef<HTMLInputElement>;

	@Output()
	public onValue: EventEmitter<string> = new EventEmitter();

	@Output()
	public onDebounce: EventEmitter<string> = new EventEmitter();

	ngOnInit(): void {
		this.debouncerSuscripcion = this.debouncer.pipe(
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

	ngOnDestroy(): void {
		this.debouncerSuscripcion?.unsubscribe();
	}

}
