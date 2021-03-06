$(function(){
  activateNestedForms();
  activateCheckboxHooks();

  if($('div.watcher.nested').length)
    activateTypeSelector('watcher');

  if($('div.issue_tracker.nested').length)
    activateTypeSelector('issue_tracker', 'tracker_params');
});

function activateNestedForms() {
  $('.nested-wrapper').each(function(){
    var wrapper = $(this);

    makeNestedItemsDestroyable(wrapper);

    var addLink = $('<a/>').text('add another').addClass('add-nested');
    addLink.click(appendNestedItem);
    wrapper.append(addLink);
  });
  $('.nested a.remove-nested').live('click',removeNestedItem);
}

function makeNestedItemsDestroyable(wrapper) {
  wrapper.find('.nested').each(function(){
    var nestedItem = $(this);
    var destroyLink = $('<a/>').text('remove').addClass('remove-nested');
    destroyLink.css('float','right');
    nestedItem.find('label').first().before(destroyLink);
  })
}

function appendNestedItem() {
  var addLink = $(this);
  var nestedItem = addLink.parent().find('.nested').first().clone().show();
  var timestamp = new Date();
  timestamp = timestamp.valueOf();

  nestedItem.find('input, select').each(function(){
    var input = $(this);
    input.attr('id', input.attr('id').replace(/([_\[])\d+([\]_])/,'$1'+timestamp+'$2'));
    input.attr('name', input.attr('name').replace(/([_\[])\d+([\]_])/,'$1'+timestamp+'$2'));
    if(input.attr('type') != 'radio')
      input.val('');
  });
  nestedItem.find('label').each(function(){
    var label = $(this);
    label.attr('for', label.attr('for').replace(/([_\[])\d+([\]_])/,'$1'+timestamp+'$2'));
  });
  addLink.before(nestedItem);
}

function removeNestedItem() {
  var destroyLink = $(this);
  var nestedItem = destroyLink.closest('.nested');
  var inputNameExample = nestedItem.find('input').first().attr('name');
  var idFieldName = inputNameExample.replace(/\[[^\]]*\]$/,'[id]');
  if($("input[name='"+idFieldName+"']").length) {
    var destroyFlagName = inputNameExample.replace(/\[[^\]]*\]$/,'[_destroy]')
    var destroyFlag = $('<input/>').attr('name',destroyFlagName).attr('type','hidden').val('true');
    $("input[name='"+idFieldName+"']").after(destroyFlag);
  }
  nestedItem.hide();
}


function activateTypeSelector(field_class, section_class) {
  var section_class = section_class || field_class+"_params";   // section_class can be deduced if not given
  // disable all inactive tabs to avoid sending its values on server
  $('div.'+field_class+' > div.'+section_class).not('.chosen').find('input')
    .attr('disabled','disabled').val('');

  $('div.'+field_class+' input[name*=type]').live('click', function(){
    var chosen = $(this).data("section");
    var wrapper = $(this).closest('.nested');
    wrapper.find('div.chosen.'+section_class).removeClass('chosen').find('input').attr('disabled','disabled');
    wrapper.find('div.'+section_class+'.'+chosen).addClass('chosen').find('input').removeAttr('disabled');
  });
}


function activateCheckboxHooks() {
  // Hooks to hide/show content when a checkbox is clicked
  $('input[type="checkbox"][data-hide-when-checked]').each(function(){
    $(this).change(function(){
      el = $($(this).data('hide-when-checked'));
      $(this).attr('checked') ? el.hide() : el.show();
    });
  });
  $('input[type="checkbox"][data-show-when-checked]').each(function(){
    $(this).change(function(){
      el = $($(this).data('show-when-checked'));
      $(this).attr('checked') ? el.show() : el.hide();
    });
  });
}

