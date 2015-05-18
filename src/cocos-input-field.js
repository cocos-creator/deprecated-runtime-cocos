// cocos-text-field
RenderContext.prototype.getInputText = function (target) {
    var obj = this.getRenderObj(target);
    if (obj) {
       return obj.getString();
    }
    return null;
};

RenderContext.prototype.setInputText = function (target) {
    var obj = this.getRenderObj(target);
    if (obj) {
        obj.setString(target._text);
    }
    // @ifdef EDITOR
    obj = this.getRenderObjInScene(target);
    if (obj) {
        obj.setString(target._text);
    }
    // @endif
};

RenderContext.prototype.setFontName = function (target) {
    var fontName = "";
    if (target.fontType !== Fire.FontType.Custom){
        fontName = Fire.FontType[target.fontType].toLowerCase();
    }
    else{
        fontName = target.customFontType;
    }
    var obj = this.getRenderObj(target);
    if (obj) {
        obj.setFontName(fontName);
    }
    // @ifdef EDITOR
    obj = this.getRenderObjInScene(target);
    if (obj) {
        obj.setFontName(fontName);
    }
    // @endif
};

RenderContext.prototype.setFontSize = function (target) {
    var obj = this.getRenderObj(target);
    if (obj) {
        target._renderObj.setFontSize(target._size);
    }
    // @ifdef EDITOR
    obj = this.getRenderObjInScene(target);
    if (obj) {
        obj.setFontSize(target._size);
    }
    // @endif
};

RenderContext.prototype.setTextColor = function (target) {
    var obj = this.getRenderObj(target);
    if (obj) {
        obj.setFontColor(target._color.toCCColor());
    }
    // @ifdef EDITOR
    obj = this.getRenderObjInScene(target);
    if (obj) {
        obj.setFontColor(target._color.toCCColor());
    }
    // @endif
};

RenderContext.prototype.setMaxLength = function (target) {
    var obj = this.getRenderObj(target);
    if (obj) {
        obj.setMaxLength(target._maxLength);
    }
    // @ifdef EDITOR
    obj = this.getRenderObjInScene(target);
    if (obj) {
        obj.setMaxLength(target._maxLength);
    }
    // @endif
};

RenderContext.prototype.setInputFlag = function (target) {
    var obj = this.getRenderObj(target);
    if (obj) {
        obj.setInputFlag(target._fontFlagType);
    }
    // @ifdef EDITOR
    obj = this.getRenderObjInScene(target);
    if (obj) {
        obj.setInputFlag(target._fontFlagType);
    }
    // @endif
};

var createEditBox = function (target) {
    var node, fontSize, fontName = "";
    if (target.fontType !== Fire.FontType.Custom){
        fontName = Fire.FontType[target.fontType].toLowerCase();
    }
    else{
        fontName = target.customFontType;
    }
    if (! target.background) {
        Fire.error("Background does not allow empty");
        return null;
    }
    fontSize = cc.size(target.background.renderWidth, target.background.renderHeight);
    node = new cc.EditBox(fontSize, new cc.Scale9Sprite());
    node.setAnchorPoint(0, 1);
    node.setString(target._text);
    node.setFont(fontName, target._size);
    node.setFontColor(target._color.toCCColor());
    node.setLocalZOrder(-1);
    return node
};

// @ifdef EDITOR
var InputFieldDelegate = cc.EditBoxDelegate.extend({
    _target: null,
    _renderContext: null,
    ctor: function (renderContext, inputField) {
        this._target = inputField;
        this._renderContext = renderContext;
    },
    editBoxTextChanged: function (editBox, newText) {
        var obj = this._renderContext.getRenderObjInScene(this._target);
        if (obj) {
            obj.setString(newText);
        }
    }
})
// @endif

RenderContext.prototype.initInputField = function (target) {
    var node, delegate;
    var inGame = !(target.entity._objFlags & HideInGame);
    if (inGame) {
        this.game.setEnvironment();
        node = createEditBox(target);
        if (! node){
            return;
        }
        target._renderObj = node;
        node.setMaxLength(target._maxLength);
        // @ifdef EDITOR
        delegate = new InputFieldDelegate(this, target);
        node.setDelegate(delegate);
        // @endif
        target.entity._ccNode.addChild(node);
    }
    // @ifdef EDITOR
    if (this.sceneView) {
        this.sceneView.game.setEnvironment();
        node = createEditBox(target);
        if (! node){
            return;
        }
        target._renderObjInScene = node;
        target.entity._ccNodeInScene.addChild(node);
    }
    // @endif
};

RenderContext.prototype.getTextSize = function (target) {
    var size = null;
    var obj = target._renderObj;
    if (obj) {
        size = obj.getContentSize();
    }
    // @ifdef EDITOR
    if (! size) {
        obj = target._renderObjInScene;
        if (obj) {
            size = obj.getContentSize();
        }
    }
    // @endif
    return size ? new Vec2(size.width, size.height) : Vec2.zero;
};

RenderContext.prototype.updateInputFieldTransform = RenderContext.prototype.updateTransform;
