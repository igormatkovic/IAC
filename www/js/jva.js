/**
 * Created with JetBrains PhpStorm.
 * User: Nebojša
 * Date: 24.5.13.
 * Time: 02.43
 * To change this template use File | Settings | File Templates.
 */
$(function() {

$(document).on('click','.tabs a',function(){
    var val=$(this).attr('href').replace('#','');
    $('.tab').hide();
    $('.tabs a').removeClass('tabactive');
    $(this).addClass('tabactive');

    $('#'+val).show();
})
});