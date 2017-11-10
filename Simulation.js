function Simulation($el,question){

			var w = 5;
			var h = 5;
			var d = 5;
			var fill = 0;
			var scale = 10;
			var amount = 0;
			var rate = 10000; //cubic cm per second

			

			function redraw(){
				fillBox($el.find('.box.container'),1);
				fillBox($el.find('.box.fill'),fill);

				if(fill==0) $el.find('.box.fill').hide();
				else $el.find('.box.fill').show();

				$el.find('.calculation .l').text(w);
				$el.find('.calculation .h').text(h);
				$el.find('.calculation .b').text(d);
				$el.find('.calculation .v').text(w*h*d);

				if(question && question.type == 'volume'){
					$el.find('.calculation .l').text('?');
					$el.find('.calculation .h').text('?');
					$el.find('.calculation .b').text('?');
					$el.find('.calculation .v').text('?');
				}
			}

			function fillBox($box,amount){
				var $sides = $box.find('.box-side');
				var $left = $sides.filter('.left');
				var $right = $sides.filter('.right');
				var $base = $sides.filter('.base');
				var $back = $sides.filter('.back');
				var $front = $sides.filter('.front');
				var $top = $sides.filter('.top');
				$front.width(w*scale);
				$front.height(h*scale*amount);
				$back.width(w*scale);
				$back.height(h*scale*amount);
				$back.css({left:d*scale/2,bottom:d*scale/2});
				$left.width(d*scale/2);
				$left.height(h*scale*amount);
				$right.width(d*scale/2);
				$right.height(h*scale*amount);
				$right.css({left:w*scale});
				$base.width(w*scale);
				$base.height(d*scale/2);
				$top.width(w*scale);
				$top.height(d*scale/2);
				$top.css({bottom:h*scale*amount});
				$el.find('.faucet-water').height(310-h*scale*amount);
			}

			new Slider($el.find('.slider.width'),w,5,50,function(v){
				w = v;
				stopAndRedraw();
			});
			new Slider($el.find('.slider.height'),h,5,25,function(v){
				h = v;
				stopAndRedraw();
			});
			new Slider($el.find('.slider.depth'),d,5,15,function(v){
				d = v;
				stopAndRedraw();
			});

			function stopAndRedraw(){
				clearInterval(idFillInterval);
				fill = 0;
				$el.find('.faucet-water').hide();
				$el.find('.timer').text('0.00');
				redraw();
			}

			var idFillInterval = null;

			$el.find('select').on('change',stopAndRedraw);

			function doFill(){
				clearInterval(idFillInterval);

				$el.find('.faucet-water').show();
				rate = $el.find('select').val();

				var volume = w*h*d; // cubic cms
				var duration = volume/rate; // in seconds

				var timeStart = new Date().getTime();
				idFillInterval = setInterval(function(){
					var timeNow = new Date().getTime();
					var elapsed = timeNow-timeStart;
					var seconds = elapsed/1000;
					fill = seconds/duration;
					if(fill>1){
						fill = 1;
						clearInterval(idFillInterval);
						$el.find('.faucet-water').hide();
					}

					var timeFixed = fill*duration;
					var str = timeFixed.toFixed(2);
					$el.find('.timer').text(str);

					redraw();
				},10);
			}

			if(question){

				var cntAttempt = 0;

				w = question.l;
				h = question.h;
				d = question.b;
				rate = question.rate;
				$el.find('select').empty();
				$('<option value='+rate+'>'+rate+'cm³ per second</option>').appendTo($el.find('select'));
				$el.find('select').val(rate);
				$el.find('select').attr('disabled','disabled');

				var solution;

				if(question.type == 'time'){
					$el.find('.simulation-question-text').text("Predicted Time:");
					$el.find('.simulation-question-unit').html("seconds");
					$el.find('.faucet-info').addClass('inactive');
					solution = w*h*d/rate;
				}
				if(question.type == 'rate'){
					$el.find('.simulation-question-text').html("Calculated Rate:");
					$el.find('.simulation-question-unit').html("cm<sup>3</sup> per second");
					$el.find('.faucet').click(doFill);
					solution = rate;
				}
				if(question.type == 'volume'){
					$el.find('.simulation-question-text').html("Calculated Volume:");
					$el.find('.simulation-question-unit').html("cm<sup>3</sup>");
					$el.find('.faucet').click(doFill);
					solution = w*h*d;
				}

				new QuestionInput($el.find('.simulation-question-input'),solution,question.id);

			} else {
				$el.find('.simulation-question-input').hide();
				$el.find('.faucet').click(doFill);
			}
			
			redraw();

			$el.find('.faucet-water').hide();

			function Slider($el,start,min,max,callback){
				if(question) $el.find('.slider-thumb').hide()
				else $el.find('.slider-thumb').on('mousedown',onDrag.bind(this));

				function onDrag(e){
					$('body').on('mousemove',onMove);
					$('body').on('mouseup',onDrop.bind(this));
				}

				function onMove(e){
					e.preventDefault();
					var ox = e.pageX - $el.offset().left;
					var value = Math.round(ox/scale);
					value = Math.max(min,Math.min(max,value));
					drawAt(value);
				}

				function drawAt(value){
					$el.find('.slider-thumb').css({left:value*scale-10});
					$el.find('.slider-value').width(value*scale);
					$el.find('.slider-value').text(value + 'cm');
					callback(value);

					if(question && question.type == 'volume'){
						$el.find('.slider-value').text('? cm');
					}
				}

				function onDrop(e){
					$('body').off('mousemove',onMove);
				}

				drawAt(start);
				$el.width(max*scale);
			}
		}