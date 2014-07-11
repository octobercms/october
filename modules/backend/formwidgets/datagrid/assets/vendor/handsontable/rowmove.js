/**
 * Row move plugin
 */
function HandsontableManualRowMove() {

  var pressed,
      startRow,
      endRow,
      startY,
      startOffest;

  var ghost = document.createElement('DIV'),
      ghostStyle = ghost.style;

  ghost.className = 'ghost';
  ghostStyle.position = 'absolute';
  ghostStyle.top = '25px';
  ghostStyle.left = '50px';
  ghostStyle.width = '10px';
  ghostStyle.height = '10px';
  ghostStyle.backgroundColor = '#CCC';
  ghostStyle.opacity = 0.7;

  var saveManualRowPostions = function () {
    var instance = this;

    instance.PluginHooks.run('persistentStateSave', 'manualRowPostions', instance.manualRowPositions);
  };

  var loadManualRowPositions = function () {
    var instance = this,
        storedState = {};

    instance.PluginHooks.run('persistentStateLoad', 'manualRowPositions', storedState);

    return storedState.value;
  };

  var bindMoveRowEvents = function () {
    var instance = this;

    instance.rootElement.on('mousemove.manualRowMove', function (e) {
      if (pressed) {
        ghostStyle.top = startOffest + e.pageY - startY + 'px';
        if (ghostStyle.display === 'none') {
          ghostStyle.display = 'block';
        }
      }
    });

    instance.rootElement.on('mouseup.manualRowMove', function () {
      if (pressed) {
        if (startRow < endRow) {
          endRow--;
        }

        if (instance.getSettings().colHeaders) {
          startRow--;
          endRow--;
        }

        instance.manualRowPositions.splice(endRow, 0, instance.manualRowPositions.splice(startRow, 1)[0]);
        $('.manualRowMover.active').removeClass('active');

        pressed = false;
        instance.forceFullRender = true;
        instance.view.render();
        ghostStyle.display = 'none';

        saveManualRowPostions.call(instance);

        instance.PluginHooks.run('afterRowMove', startRow, endRow);
      }
    });

    instance.rootElement.on('mousedown.manualRowMove', '.manualRowMover', function (e) {
      var mover = e.currentTarget,
          TH = instance.view.wt.wtDom.closest(mover, 'TH'),
          TR = TH.parentNode;

      startRow = parseInt(instance.view.wt.wtDom.index(TR), 10) + 1 + instance.rowOffset();
      endRow = startRow;
      pressed = true;
      startY = e.pageY;

      var TABLE = instance.$table[0];
      TABLE.parentNode.appendChild(ghost);
      ghostStyle.width = instance.view.wt.wtDom.outerWidth(TABLE) + 'px';
      ghostStyle.height = instance.view.wt.wtDom.outerHeight(TH) + 'px';
      startOffest = parseInt(instance.view.wt.wtDom.offset(TH).top - instance.view.wt.wtDom.offset(TABLE).top, 10);
      ghostStyle.top = startOffest + 'px';
    });

    instance.rootElement.on('mouseenter.manualRowMove', 'table tbody th, table tbody td', function (e) {
      if (pressed) {
        var active = instance.view.TBODY.querySelector('.manualRowMover.active');
        if (active) {
          instance.view.wt.wtDom.removeClass(active, 'active');
        }

        var currentTarget = e.currentTarget,
            TR = currentTarget.parentNode,
            rowOffset = instance.rowOffset();

        endRow = parseInt(instance.view.wt.wtDom.index(TR), 10) + 1 + rowOffset;

        var THs = instance.view.TBODY.querySelectorAll('th'),
            totalVisibleRows = instance.countVisibleRows(),
            currentPosition = (endRow > totalVisibleRows ? endRow - rowOffset : endRow);

        var mover = THs[currentPosition].querySelector('.manualRowMover');
        instance.view.wt.wtDom.addClass(mover, 'active');
      }
    });

    instance.addHook('afterDestroy', unbindMoveRowEvents);
  };

  var unbindMoveRowEvents = function () {
    var instance = this;
    instance.rootElement.off('mouseup.manualRowMove');
    instance.rootElement.off('mousemove.manualRowMove');
    instance.rootElement.off('mousedown.manualRowMove');
    instance.rootElement.off('mouseenter.manualRowMove');
  };

  this.beforeInit = function () {
    this.manualRowPositions = [];
  };

  this.init = function (source) {
    var instance = this;

    var manualRowMoveEnabled = !!(instance.getSettings().manualRowMove);

    if (manualRowMoveEnabled) {
      var initialManualRowPositions = instance.getSettings().manualRowMove;

      var loadedManualRowPostions = loadManualRowPositions.call(instance);

      if (typeof loadedManualRowPostions != 'undefined') {
        this.manualRowPositions = loadedManualRowPostions;
      } else if(initialManualRowPositions instanceof Array) {
        this.manualRowPositions = initialManualRowPositions;
      } else {
        this.manualRowPositions = [];
      }

      instance.forceFullRender = true;

      if (source === 'afterInit') {
        bindMoveRowEvents.call(this);
        instance.forceFullRender = true;
        instance.render();
      }
    } else {
      unbindMoveRowEvents.call(this);
      instance.manualRowPositions = [];
    }

  };

  this.modifyRow = function (row) {
    var instance = this;
    if (instance.getSettings().manualRowMove) {
      if (typeof instance.manualRowPositions[row] === 'undefined') {
        instance.manualRowPositions[row] = row;
      }
      return instance.manualRowPositions[row];
    }

    return row;
  };

  this.getRowHeader = function (row, TH) {
    if (this.getSettings().manualRowMove) {
      var DIV = document.createElement('DIV');
      DIV.className = 'manualRowMover';
      TH.firstChild.appendChild(DIV);
    }
  };
}

var htManualRowMove = new HandsontableManualRowMove();

Handsontable.PluginHooks.add('beforeInit', htManualRowMove.beforeInit);
Handsontable.PluginHooks.add('afterInit',  function () {
  htManualRowMove.init.call(this, 'afterInit');
});

Handsontable.PluginHooks.add('afterUpdateSettings', function () {
  htManualRowMove.init.call(this, 'afterUpdateSettings');
});

Handsontable.PluginHooks.add('afterGetRowHeader', htManualRowMove.getRowHeader);
Handsontable.PluginHooks.add('modifyRow', htManualRowMove.modifyRow);
