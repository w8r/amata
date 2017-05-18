/* --- slider class
   slider with tabs control
*/
var slider = new Class({
    Implements: Options,
    options:{		
    },
    initialize: function(container,tabsContainer,contentContainer){
		this.container = $(container);
		this.tabs      = $(tabsContainer);
		this.content   = $(contentContainer);
		this.setRelations();
		this.setTriggers();
		this.tabs.getElements('li')[0].fireEvent('mouseover');
    },
	setTriggers:function(){
		this.tabs.getElements('li').addEvent('mouseover',this.highlightTab);
		this.tabs.getElements('li').addEvent('mouseover',this.setCurrentTab);
		this.tabs.getElements('a').addEvent('click',function(e){e.preventDefault();});
		this.tabs.addEvent('mouseout',function(){
				this.getFirst().getElements('li').removeClass('active').removeClass('after-active');
				this.getFirst().removeClass('active');
		});
		this.content.getElements('div.tab').each(function(item){
			item.set('morph',{duration: 2000});
		});
	},
	setRelations:function(){
		var triggersArray = this.tabs.getElements('li');
		for(var i = 0; i < triggersArray.length;i++){			
			var tabId = new String(triggersArray[i].id);
			tabId = "tab" + tabId.substring(11,tabId.length);
			triggersArray[i].tabId = tabId;
			$(triggersArray[i].tabId).set('morph', {duration: 'long', transition: 'expo'});
		}
	},
	highlightTab:function(){
		$(this).getParent().removeClass('active').getElements('li').removeClass('active').removeClass('after-active');
		$(this).addClass('active');		
		if($(this).getNext()){
			$(this).getNext().addClass('after-active');
			$(this).getParent().removeClass('active');
		} else {
			$(this).getParent().addClass('active');
		}
	},
	setCurrentTab:function(e){		
		$(this).getParent().removeClass('selected').getElements('li').removeClass('selected').removeClass('after-selected');
		$(this).addClass('selected');
		if($(this).hasClass('first')){
			$(this).addClass('first-selected');
		} else {
			if($(this).getParent().getElement('li.first-selected'))
				$(this).getParent().getElement('li.first-selected').removeClass('first-selected');
		}
		if($(this).getNext()){
			$(this).getNext().addClass('after-selected');
			$(this).getParent().removeClass('selected');
		} else {
			$(this).getParent().addClass('selected');
		}
		$(this.tabId).getParent().getChildren('div.tab').morph({display:'none'});
		$(this.tabId).morph({display:'block'});		
	}
});