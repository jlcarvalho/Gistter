'use strict';
/*jshint esnext: true */

class HandleDirective {
    constructor () {
        this.template = '<div class="handle"></div>';
        this.replace = true;
        this.restrict = 'E';
    }

    link (scope, element) {
        var priorCursor = $('body').css('cursor');

        $(element).on('mousedown', function(e){
            priorCursor = $('body').css('cursor');
            $('body').css('cursor', 'col-resize');

            var node = $(this).addClass('draggable');
            var zindex = node.css('z-index');

            var drg_w = node.outerWidth(),
                pos_x = node.offset().left + drg_w - e.pageX;

            var handlers = {
                mousemove : function(e){
                    var prev = node.prev();
                    var next = node.next();

                    node.css('z-index', 9999);

                    var total = prev.outerWidth() + next.outerWidth();

                    var leftPercentage = (((e.pageX - prev.offset().left) + (pos_x - drg_w / 2)) / total);
                    var rightPercentage = 1 - leftPercentage;

                    prev.css('flex', leftPercentage.toString());
                    next.css('flex', rightPercentage.toString());

                },
                mouseup : function (){
                  $('body').css('cursor', priorCursor);
                  $('.draggable').removeClass('draggable').css('z-index', zindex);
                  $(this).off(handlers);
                }
            };
            $(document).on(handlers);
        });
    }

    static directiveFactory() {
        HandleDirective.instance = new HandleDirective();
        return HandleDirective.instance;
    }
}

export default HandleDirective;


// (function($) {
//     $.fn.drags = function(opt) {

//       opt = $.extend({handle:"",cursor:"ew-resize", min: 10}, opt);

//         if(opt.handle === "") {
//             var $el = this;
//         } else {
//             var $el = this.find(opt.handle);
//         }

//         var priorCursor = $('body').css('cursor');

//         return $el.css('cursor', opt.cursor).on("mousedown", function(e) {

//             priorCursor = $('body').css('cursor');
//             $('body').css('cursor', opt.cursor);

//             if(opt.handle === "") {
//                 var $drag = $(this).addClass('draggable');
//             } else {
//                 var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
//             }
//             var z_idx = $drag.css('z-index'),
//                 drg_h = $drag.outerHeight(),
//                 drg_w = $drag.outerWidth(),
//                 pos_y = $drag.offset().top + drg_h - e.pageY,
//                 pos_x = $drag.offset().left + drg_w - e.pageX;
//             $drag.css('z-index', 1000).parents().on("mousemove", function(e) {

//               var prev = $('.draggable').prev();
//               var next = $('.draggable').next();

//               // Assume 50/50 split between prev and next then adjust to
//               // the next X for prev

//               var total = prev.outerWidth() + next.outerWidth();


//               console.log('l: ' +  prev.outerWidth() + ', r:' + next.outerWidth());

//               var leftPercentage = (((e.pageX - prev.offset().left) + (pos_x - drg_w / 2)) / total);
//               var rightPercentage = 1 - leftPercentage;

//               if(leftPercentage * 100 < opt.min || rightPercentage * 100 < opt.min)
//               {
//                 return;
//               }

//               console.log('l: ' + leftPercentage + ', r:' + rightPercentage);

//               prev.css('flex', leftPercentage.toString());
//               next.css('flex', rightPercentage.toString());

//                 $(document).on("mouseup", function() {
//                   $('body').css('cursor', priorCursor);
//                     $('.draggable').removeClass('draggable').css('z-index', z_idx);
//                 });
//             });
//             e.preventDefault(); // disable selection
//         });

//     }
// })(jQuery);

// $('.handle').drags();
