var datePicker = new Class({

	Implements: [Options,Events],

	options: {
		format: '%d/%m/%Y',
		position: {x:'left',y:'bottom'},
		offset: {x:0,y:5},
		from: false,
		to: false,
		initial: false,
		setInitial: false,
		updateElement: true,
		draggable: false,
		firstday: 0,
		klass: 'datePicker',
		days: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
		months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		onShow: function(container){
			container.setStyle('display','block');
		},
		onHide: function(container){
			container.setStyle('display','none');
		}
		/*onUpdate: $empty*/
	},

	initialize: function(el,options){
		this.el = el;
		this.setOptions(options);
		this.current = this.options.initial ? new Date(this.options.initial[0],this.options.initial[1],this.options.initial[2]) : (this.options.from ? new Date(this.options.from[0],this.options.from[1],this.options.from[2]) : new Date());
		this.limit = {from:false,to:false};
		this.open = false;

		// DOM
		var tr;
		this.dom = {days:[]};
		this.dom.container = new Element('div',{'class':this.options.klass}).setStyle('visibility','hidden').inject(document.body);
			var handle = new Element('div',{'class':'handle'}).inject(this.dom.container);
			var body = new Element('div',{'class':'body'}).inject(this.dom.container);
			var table = new Element('table').inject(body);
				var thead = new Element('thead').inject(table);
					tr = new Element('tr').inject(thead);
						this.dom.month = new Element('b').inject(new Element('td',{colspan:3}).inject(tr));
						this.dom.monthDown = new Element('span',{'class':'down'}).addEvent('click',this.walk.bind(this,['Month',-1,'monthDown']));
						this.dom.monthUp = new Element('span',{'class':'up'}).addEvent('click',this.walk.bind(this,['Month',1,'monthUp']));
						new Element('div',{'class':'incdec'}).adopt(this.dom.monthDown,this.dom.monthUp).injectAfter(this.dom.month);
						this.dom.year = new Element('b').inject(new Element('td',{colspan:3}).inject(tr));
						this.dom.yearDown = new Element('span',{'class':'down'}).addEvent('click',this.walk.bind(this,['FullYear',-1,'yearDown']));;
						this.dom.yearUp = new Element('span',{'class':'up'}).addEvent('click',this.walk.bind(this,['FullYear',1,'yearUp']));;
						new Element('div',{'class':'incdec'}).adopt(this.dom.yearDown,this.dom.yearUp).injectAfter(this.dom.year);
						new Element('td',{'class':'close'}).set('html','X').addEvent('click',this.hide.bind(this)).inject(tr);
					tr = new Element('tr').inject(thead);
						var day = this.options.firstday;
						for(var i=0;i<7;i++){
							new Element('th').set('html',this.options.days[day].substr(0,1)).inject(tr);
							day += day>5?-6:1;
						}
				var tbody = new Element('tbody').inject(table);
					var i = 0;
					for(var y=0;y<6;y++){
						tr = new Element('tr').inject(tbody);
						for(var x=0;x<7;x++){
							this.dom.days[i] = new Element('td').addEvent('click',this.select.bind(this,[i])).inject(tr);
							i += 1;
						}
					}

		if(this.options.draggable){
			this.dom.container.makeDraggable({handle:handle.setStyle('cursor','move')});
		}

		this.deselect();

		if(this.options.initial && this.options.setInitial){
			this.setFullDate(this.options.initial[0],this.options.initial[1],this.options.initial[2]).update();
		}
	},

	walk: function(ref,increment,but){
		if(!ref || !this.dom[but].hasClass('disabled')){
			if(ref){
				this.current['set'+ref](this.current['get'+ref]()+increment);
			}
			this.limit = {from:false,to:false};
			var now = this.parse();
			[['from','Down',true],['to','Up',false]].each(function(arr){
				var ybut = this.dom['year'+arr[1]].removeClass('disabled');
				var mbut = this.dom['month'+arr[1]].removeClass('disabled');
				if(this.options[arr[0]]){
					var cmp = this.options[arr[0]].associate(['y','m','d']);
					if((arr[2] && now.y<=cmp.y) || (!arr[2] && now.y>=cmp.y)){
						ybut.addClass('disabled');
						if((arr[2] && now.y<cmp.y) || (!arr[2] && now.y>cmp.y)){
							this.current.setFullYear(cmp.y,cmp.m,cmp.d);
							this.limit[arr[0]] = true;
						}else if((arr[2] && now.m<=cmp.m) || (!arr[2] && now.m>=cmp.m)){
							mbut.addClass('disabled');
							this.current.setMonth(cmp.m);
							this.limit[arr[0]] = true;
						}
					}
				}
			},this);
			this.build();
		}
	},

	build: function(){
		var date = this.parse();

		this.dom.month.innerHTML = this.options.months[date.m].substr(0,3).toUpperCase();
		this.dom.year.innerHTML = date.y;

		var x0 = new Date(date.y,date.m,1).getDay();
		var x1 = new Date(date.y,date.m+1,0).getDate();

		x0 += x0-this.options.firstday<0 ? 7-this.options.firstday : -this.options.firstday;

		var day, atr;
		for(i=0;i<42;i++){
			day = i-x0+1;
			atr = ['',''];
			if(day>0 && day<=x1){
				if((this.limit.from && day<this.options.from[2]) || (this.limit.to && day>this.options.to[2])){
					atr = [day,''];
				}else if(date.y==this.selected.date.y && date.m==this.selected.date.m && day==this.selected.date.d){
					atr = [day,'selected'];
					this.selected.index = i;
				}else{
					atr = [day,'selectable'];
				}
			}
			this.dom.days[i].set('html',atr[0]).className = atr[1];
		}
	},

	select: function(i){
		if(this.dom.days[i].hasClass('selectable')){
			this.dom.days[i].className = 'selected';
			this.current.setDate(this.dom.days[i].innerHTML.toInt());
			if(this.selected.index && this.selected.date.y==this.current.getFullYear() && this.selected.date.m==this.current.getMonth()){
				this.dom.days[this.selected.index].className = 'selectable';
			}
			this.selected = {date:this.parse(),index:i};
			this.update();
			this.hide();
		}else if(this.dom.days[i].hasClass('selected')){
			this.hide();
		}
	},

	deselect: function(){
		this.selected = {date:{y:0,m:0,d:0},index:false};
		this.walk();
		return this;
	},

	update: function(){
		if(this.options.updateElement){
			this.el[$defined(this.el.value)?'value':'innerHTML'] = this.selected.index===false ? '' : this.format();
		}
		this.fireEvent('update',[this.selected.date]);
		return this;
	},

	show: function(){
		if(!this.open){
			this.open = true;
			var s = this.el.getCoordinates();
			this.dom.container.setStyles({left:s[this.options.position.x]+this.options.offset.x,top:s[this.options.position.y]+this.options.offset.y,visibility:'visible'});
			this.fireEvent('show',[this.dom.container,this.el,this.options.position,this.options.offset]);
		}
		return this;
	},

	hide: function(){
		if(this.open){
			this.open = false;
			this.fireEvent('hide',[this.dom.container,this.el]);
		}
		return this;
	},

	parse: function(){
		return [this.current.getFullYear(),this.current.getMonth(),this.current.getDate()].associate(['y','m','d']);
	},

	setFullDate: function(y,m,d){
		this.current.setFullYear(y,m,d);
		this.selected.date = this.parse();
		this.walk();
		return this;
	},

	format: function(ymd,format){
		ymd = ymd ? ($type(ymd)=='array' ? ymd.associate(['y','m','d']): ymd) : this.selected.date;
		var date = new Date(ymd.y,ymd.m,ymd.d);
		return (format || this.options.format).
		replace(/%d/g,(date.getDate()<10?'0'+date.getDate():date.getDate())).
		replace(/%DD/g,this.options.days[date.getDay()]).
		replace(/%D/g,this.options.days[date.getDay()].substr(0,3)).
		replace(/%m/g,(date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1)).
		replace(/%MM/g,this.options.months[date.getMonth()]).
		replace(/%M/g,this.options.months[date.getMonth()].substr(0,3)).
		replace(/%y/g,(date.getFullYear()+'').substr(2)).
		replace(/%Y/g,date.getFullYear());
	}
});

Element.implement({
	datePicker: function(options,event){
		var dp = new datePicker(this,options);
		this.addEvent((event||'focus'),dp.show.bind(dp));
		this.store('dp',dp);
		return dp;
	}
});

$$('a.set-date').each(function(item){
			//alert("howe");
		var inp = item.getPrevious();
		inp = item.datePicker({
			format: '%d-%m-%Y',
			from: [2008,0,1],
			setInitial: true,
			updateElement: false,
			onShow: function(container){
				container.fade('hide').fade('in');
			},
			onHide: function(container){
				container.fade('out');
			},
			onUpdate: function(){
				inp.set('value',this.format());
			}
		},'click');
});