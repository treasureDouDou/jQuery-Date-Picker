/*
GITHUB:https://github.com/doudouyoutangtang
AUTHOR : Cheng Li
EMAIL : 564526299@qq.com
Date: 2016-11-27
 */
;(function($){
  'use strict'
  function lcDate(el,options){
    this.date = new Date();
    this.arr_week = ['日','一','二','三','四','五','六'],
    this.left = el.offset().left;//输入框偏移量
    this.top = '';//同上
    this.el = el;//input对象
    this.id = el.attr('id');
    this._table = '';
    this.readability = '';//存值中介 xxxx-xx-xx
    this.defaults = {
      'position': 'bottom',//选择器位置,bottom,top
      'showToday': false,//默认显示设置或者今天的值
      'showMonth': false,//默认显示设置或者本月的值
      'showYear': false,//默认显示设置或者本年的值
/*---待定----
接下来的功能---下面的参数设置和输出设置值错误的提示有时间考虑继续做
      'isShowSet': false,//是否显示设置的值
      'startDate': '',//开始时间
      'endDate': '',//结束时间
      'setSide':[ //设置侧边栏
      {name:'一周前',day: '5'},//侧边栏设置的名称，需要距离本天的天数
      ],
 ---待定----*/
      'type': 'day',//类型，day日期选择，month月选择，year年选择
      'year': this.date.getFullYear(),//当前年
      'month': this.date.getMonth(),//当前月
      'day': this.date.getDate(),//本月第几天
      'format': '-',//自定义返回格式
      //选中的年-月-日
      //opt:{
      //  readability:返回的日期xxxx-xx-xx
      //}
      'select' : function(){},
      //选中的年-月
      //opt:{
      //  readability: xxxx-xx
      //}
      'selectMonth' : function(){},
      //选中的年
      //opt:{
      //  readability: xxxx
      //}
      'selectYear' : function(){},
    };
    this.showType = {'type': ''};//显示当前是什么类型day,month,year三种选择
    this.opt  = $.extend({},this.defaults,options);
    this._year = this.opt.year;//生成年选择器的当年最大范围的如 this.opt.year = 2015 ，在buildYear生成this._year = 2020一个轮回的最大范围
    if(!!options.month){
      this.opt.month--;
    };
    this.init();
    if(this.opt.showToday){//判断是否默认显示今天
      this.setInput('day');
    }else if(this.opt.showMonth){
      this.setInput('month')
    }else if(this.opt.showYear == true){
      this.setInput('year')
    }
  }
  lcDate.prototype = {
  constructor: lcDate,
  init: function(){
    var _this = this
    if(this.opt.type == 'day'){
      this.showType['type'] = 'day';//指定操作类型
      this.buildNormal();//生成主体
      this.buildNormalDay();//生成天
      this.el.click(function(e){
        _this._table.toggle();
      })
    }else if(this.opt.type == 'month'){
      this.showType['month'] = 'month';
      this.buildNormal();//生成主体
      this.buildMonth();
      this.el.click(function(e){
        _this._table.toggle();
        _this._table.find('.lc-prevMonth,.lc-nextMonth').hide();
      })
     this._table.find('.box-header').find('.lc-year').text(this.opt.year+'年');
    }else{
      this.buildNormal();//生成主体
      this.buildYear();
      this.showType['type'] = 'year';
      this._table.find('.box-header .lc-year').text((parseInt(this._year))+'年-'+(parseInt(this._year)+9)+'年');
      this.el.click(function(e){
        _this._table.toggle();
        _this._table.find('.lc-prevMonth,.lc-nextMonth').hide();
      })
    }
    this.setPosition();
    function documentClick(ev){//判断显示隐藏
      var e = ev.target;
      while(e){
        if($(e).hasClass('lc-date') || e.id == _this.id){
          return false
        }
        e = e.parentNode;
      }
      _this._table.hide();
    };
    $(document).on('click',documentClick);
      _this._table.on('click','.lc-click[data-role]',function(){
      _this.bindClick[$(this).data('role')].call(_this,this);//触发对应的事件，_this => lc-date, this => td
    });
  },
  arr_day: function(){//获取每年月的天数
    return [31,this.is_leap(this.opt.year),31,30,31,30,31,31,30,31,30,31];
  },
  nowDay: function(){//获取当月1号是第几个格子
   return new Date(this.opt.year,this.opt.month,1).getDay()==0?7:new Date(this.opt.year,this.opt.month,1).getDay()
  },
  is_leap: function(year){//判断闰年
    return (year % 4 == 0? (year % 100 == 0? true : false) : (year % 4 == 0? true : false))? 29 : 28
  },
  setPosition: function(){//设置选择器位置
    if(this.opt.position == 'bottom'){
      this.top = this.el.offset().top + this.el.outerHeight();
    }else this.top = this.el.offset().top - $('.lc-date-'+this.id).outerHeight();
      this._table.offset({top: this.top,left: this.left});
  },
  setInput: function(type){//输出值
    if(type == 'day'){
      this.readability = (this.opt.year + this.opt.format + (this.opt.month < 9?('0'+(this.opt.month+1)):(this.opt.month+1)) + this.opt.format + this.opt.day);
    }else if(type == 'month'){
      this.readability = this.opt.year + this.opt.format + ((this.opt.month+1)<10?('0'+(this.opt.month+1)):this.opt.month+1);
    }else if(type == 'year'){
      this.readability = this.opt.year;
    }
    this.el.val(this.readability)
  },
  preSetYear: function(){
    this.buildYear();
    this._table
    .find('.box-header .lc-year')
    .text((parseInt(this._year))+'年-'+(parseInt(this._year)+9)+'年')
    .end()
    .find('.table-year').show();
  },
  bindClick:{
    'next-year': function(){
      if(this.showType['type'] == 'day'){
        this.opt.year++;
        this.opt.day = '';
        this.buildNormalDay();
      }else if(this.showType['type'] == 'year'){
        this._year+=10;
        this.preSetYear();
      }else{
        this.opt.year++;
        this._table.find('.lc-year').text(this.opt.year+'年');
      }
    },
    'next-month': function(){
      this.opt.month++;
      if(this.opt.month == 12){
        this.opt.month = 0;
        this.opt.year++;
      }
      this.opt.day = '';
      this.buildNormalDay();
    },
    'prev-year': function(){
      if(this.showType['type'] == 'day'){
        this.opt.year--;
        this.opt.day = '';
        this.buildNormalDay();
      }else if(this.showType['type'] == 'year'){
        this._year-=10;
        this.preSetYear();
      }else{
        this.opt.year--;
        this._table.find('.lc-year').text(this.opt.year+'年');
      }
    },
    'prev-month': function(){
      this.opt.month--;
      if(this.opt.month == -1){
        this.opt.month = 11;
        this.opt.year--;
      }
      this.opt.day = '';
      this.buildNormalDay();
    },
    'select-year': function(){//点击头部上的年,建立年选择器
      if( this._table.find('.table-year').length == 0 || this.opt.year < this._year){
        this._table.find('.lc-month').remove();
        this.buildYear();
      }
      this._table.find('.table-year').show().siblings().hide();
      //对应的显示
      this._table.find('.box-header')
      .find('.lc-prevMonth,.lc-nextMonth').hide()
      .end()
      .find('.lc-month').hide();
      if(this.opt.position == 'top')  this.setPosition();//如果在input上需要重新算高度，下面同理
      this.showType['type'] = 'year';//指定点击类型
      this._table.find('.box-header .lc-year').text((parseInt(this._year))+'年-'+(parseInt(this._year)+9)+'年');
    },
    'select-month': function(){//点击头部上的月,建立月份选择器
        if( this._table.find('.table-month').length == 0){
          this.buildMonth();
        }
      this._table.find('.table-month').show().siblings().hide();
      this._table.find('.box-header')
      .find('.lc-prevMonth,.lc-nextMonth').hide()
      .end()
      .find('.lc-month').hide();
      if(this.opt.position == 'top') this.setPosition();
      this._table.find('.box-header').find('.lc-year').text(this.opt.year+'年');
    },
    'choose-year': function(_this){//选择年
      this.opt.year = parseInt($(_this).text());
      $(_this).parents('tbody').find('td a').removeClass('td-year-active').end().end().addClass('td-year-active');
      this._table.find('.table-month').show().siblings().hide();
      if(this.opt.type == 'day' || this.opt.type == 'month'){
        if(this._table.find('.table-month').length == 0) this.buildMonth(this.opt);
        this._table.find('.table-month').show().siblings().hide();
        this.showType['type'] = 'month';
        this._table.find('.box-header').find('.lc-year').text(this.opt.year+'年');
        if(this.opt.type == 'day'){
          this.setInput('day')
        }else{
          this.setInput('month')
        }
      }else{
        this._table.hide();
        this.opt.selectYear({"readability": this.opt.year.toString()});//选择年回调
        this.setInput('year');
      }
    },
    'choose-month': function(_this){//选择月份
      this.opt.month = parseInt($(_this).parent().data('month'));
      $(_this).parents('tbody').find('a').removeClass('td-month-active').end().end().addClass('td-month-active');
      if(this.opt.type == 'day'){
        this._table.find('.table-day').show().siblings().hide();
        this._table.find('.box-header').children().show().siblings('.lc-month').text(this.opt.month+1 < 10? ('0'+(this.opt.month+1)+'月'): ((this.opt.month+1)+'月'));
      if(this.opt.position == 'top') this.setPosition();
        this.buildNormalDay();
        this.showType['type'] = 'day';
        this.setInput('day');
      }else if(this.opt.type == 'month'){
        this._table.hide();
        this.setInput('month');
        var opt = {"readability": this.readability}
        this.opt.selectMonth(opt);//选择月回调
      }else{

      }
    },
    'now-month-day': function(_this){//点击本月某一天
      this._table.find('table tbody td').removeClass('td-day-active')
      $(_this).addClass('td-day-active');
      this.opt.day = $(_this).text() == '今天'?(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()):($(_this).text()<10?'0'+$(_this).text():$(_this).text());
      this.setInput('day');
      var options = {//回调结果
        readability: this.readability,
      };
      this.opt.select(options);//选择天回调
      this._table.hide();
    },
    'prev-month-day': function(_this){//上一个月某一天
      this.opt.month--;
      if(this.opt.month == -1){
        this.opt.month = 11;
        this.opt.year--;
      };
      this.opt.day = $(_this).text()<10?'0'+$(_this).text():$(_this).text();//点击的当前日期用于高亮显示
      this._table.find('tbody').empty();
      this.buildNormalDay(this.opt);
      this.setInput('day')
      this._table.hide();
    },
    'next-month-day': function(_this){//下一个月某一天
      this.opt.month++;
      if(this.opt.month == 12){
        this.opt.month = 0;
        this.opt.year++;
      };
      this.opt.day = $(_this).text()<10?'0'+$(_this).text():$(_this).text();//点击的当前日期用于高亮显示
      this._table.find('tbody').empty();
      this.buildNormalDay(this.opt);
      this.setInput('day')
      this._table.hide();
    }
  },
  buildNormalDay: function(){//重新排天
    var next_index = 1,//下个月的序号
    prev_index = this.nowDay(this.opt) - 1,
    _index;
    this._table.find('.table-day tbody').empty();
      for( var i = 0; i< 6; i++){
        var $_tr = $('<tr></tr>');
        for( var j = 0; j< 7; j++){
          _index = i * 7 + j - this.nowDay(this.opt) + 1;//从1开始
          if(_index <= 0){//显示上一月最后的日子
            if(this.opt.month == 0){//如果是1月
              $_tr.append($('<td class="td-day-prev lc-click" data-role="prev-month-day">' + (this.arr_day(this.opt)[11] - prev_index)+ '</td>'));
            }else if(this.opt.month == 1){//如果是2月
              $_tr.append($('<td class="td-day-prev lc-click" data-role="prev-month-day">' + (this.arr_day(this.opt)[0] - prev_index)+ '</td>'));
            }else{
              $_tr.append($('<td class="td-day-prev lc-click" data-role="prev-month-day">' + (this.arr_day(this.opt)[this.opt.month-1] - prev_index)+ '</td>'));
            }
            prev_index--;
          }else if(_index > this.arr_day(this.opt)[this.opt.month]){//显示下一月的开始日子
            $_tr.append($('<td class="td-day-next lc-click" data-role="next-month-day">'+ next_index +'</td>'));
            next_index++;
          }else{
              var readability = this.readability.split(this.opt.format);
            if(readability[0] == this.opt.year &&
              (readability[1]-1) == this.opt.month &&
              readability[2] == _index && this.opt.showToday
              ){
              if(readability[2] == new Date().getDate()){//没有点击但是例如：从下一个月返回到上一个月显示之前默认的日期
                $_tr.append($('<td class="td-day-active td_today lc-click" data-role="now-month-day"></td>').text('今天'))
              }else
              $_tr.append($('<td class="td-day-active lc-click" data-role="now-month-day"></td>').text(_index))
            }else if( new Date().getFullYear() == this.opt.year && new Date().getMonth() == this.opt.month && _index == new Date().getDate()){
              if(_index == this.opt.day && this.opt.showToday){
                $_tr.append($('<td class="td-day-active td_today lc-click" data-role="now-month-day"></td>').text('今天'));//点击的是今天
              }else $_tr.append($('<td class="td_today lc-click" data-role="now-month-day"></td>').text('今天'));//点击的不是今天但要显示今天
            }else if(_index == this.opt.day){
                $_tr.append($('<td class="td-day-active lc-click" data-role="now-month-day"></td>').text(_index));
            }else{
              $_tr.append($('<td  class="lc-click" data-role="now-month-day"></td>').text(_index));
            }
          }
        }
          this._table.find('.table-day tbody').append($_tr);
          this._table.find('.lc-year').text(this.opt.year+'年');
          this._table.find('.lc-month').text((this.opt.month+1) < 10 ?('0'+(this.opt.month+1)+'月'):(this.opt.month+1)+'月');
      }
  },
  buildNormal: function(){
      var $create_box = $('<div class="lc-date lc-date-'+ this.id +'"><div class="box-header">'
      +'<button class="lc-prevYear lc-click" data-role="prev-year"><i class="fa fa-angle-double-left"></i></button>'
      +'<button class="lc-prevMonth lc-click" data-role="prev-month"><i class="fa fa-angle-left"></i></button>'
      +'<span class="lc-year lc-click" data-role="select-year"></span>'
      +'<span class="lc-month lc-click" data-role="select-month"></span>'
      +'<button class="lc-nextYear lc-click" data-role="next-year"><i class="fa fa-angle-double-right"></i></button>'
      +'<button class="lc-nextMonth lc-click" data-role="next-month"><i class="fa fa-angle-right"></i></button>'
      +'</div><div class="box-body">'
      +'</div></div>');
      var $create_table  = $('<table class="table-day"><thead></thead><tbody></tbody></table>');
      $create_box.find('.box-body').append($create_table);
      $('body').append($create_box);
      this._table = $('.lc-date-'+this.id);//存储盒子减少操作
  },
  buildYear: function(){
    this._table.find('.table-year').remove();
    var $create_year_table = $('<table class="table-year"></table>');
    var _year = '';//记录当前周期的第一年
    for(var i = 0; ;i++){//10年一个周期
      if(this._year % 10 == 0){
        break;
      }else{
        this._year--;
      }
    }
    for( var i = 0; i < 3;i++){//三行四列
      var $tr = $('<tr></tr>')
      for( var j = 0; j < 4; j++){
        if( i * 4 + j == 10 ){//第11年跳出
          break;
        }else{
          if(this._year == this.opt.year){
            $tr.append($('<td><a class="td-year-active lc-click" data-role="choose-year">' + this._year + '</a></td>'));
          }else {$tr.append($('<td><a class="lc-click" data-role="choose-year">' + this._year + '</a></td>'));}
          if(i==0 && j == 0){
              _year = this._year;
            }
          this._year++;
        }
      }
      this._table.find('.box-body').append($create_year_table.append($tr));
    };
    this._year = _year;
  },
  buildMonth: function(){
    var $create_month_table = $('<table class="table-month"></table>');
    var arr = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
    for( var i = 0; i < 3;i++){//三行四列
      var $tr = $('<tr></tr>')
      for( var j = 0; j < 4; j++){
          if((i * 4 + j) == parseInt(this.opt.month)){
            $tr.append($('<td><a class="td-month-active lc-click" data-role="choose-month">' + arr[i * 4 + j] + '月</a></td>').data('month',(i * 4 + j)));
          }else
          $tr.append($('<td><a class="lc-click" data-role="choose-month">' + arr[i * 4 + j] + '月</a></td>').data('month',(i * 4 + j)));
        this._table.find('.box-body').append($create_month_table.append($tr));
      }
    }
  }
}
  $.fn.buildDate = function(options){
    return this.each(function(){
      new lcDate($(this),options)
    })
  }
})(window.jQuery)
