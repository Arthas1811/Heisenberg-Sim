var HeisenbergMicroscope = (() => {
  // main.js
  var HeisenbergMicroscope = (() => {
    var t = class _t {
      constructor(i2, e2, s2, n2, l2 = "div") {
        this.parent = i2, this.object = e2, this.property = s2, this._disabled = false, this._hidden = false, this.initialValue = this.getValue(), this.domElement = document.createElement(l2), this.domElement.classList.add("controller"), this.domElement.classList.add(n2), this.$name = document.createElement("div"), this.$name.classList.add("name"), _t.nextNameID = _t.nextNameID || 0, this.$name.id = "lil-gui-name-" + ++_t.nextNameID, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (t2) => t2.stopPropagation()), this.domElement.addEventListener("keyup", (t2) => t2.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(s2);
      }
      name(t2) {
        return this._name = t2, this.$name.textContent = t2, this;
      }
      onChange(t2) {
        return this._onChange = t2, this;
      }
      _callOnChange() {
        this.parent._callOnChange(this), void 0 !== this._onChange && this._onChange.call(this, this.getValue()), this._changed = true;
      }
      onFinishChange(t2) {
        return this._onFinishChange = t2, this;
      }
      _callOnFinishChange() {
        this._changed && (this.parent._callOnFinishChange(this), void 0 !== this._onFinishChange && this._onFinishChange.call(this, this.getValue())), this._changed = false;
      }
      reset() {
        return this.setValue(this.initialValue), this._callOnFinishChange(), this;
      }
      enable(t2 = true) {
        return this.disable(!t2);
      }
      disable(t2 = true) {
        return t2 === this._disabled || (this._disabled = t2, this.domElement.classList.toggle("disabled", t2), this.$disable.toggleAttribute("disabled", t2)), this;
      }
      show(t2 = true) {
        return this._hidden = !t2, this.domElement.style.display = this._hidden ? "none" : "", this;
      }
      hide() {
        return this.show(false);
      }
      options(t2) {
        const i2 = this.parent.add(this.object, this.property, t2);
        return i2.name(this._name), this.destroy(), i2;
      }
      min(t2) {
        return this;
      }
      max(t2) {
        return this;
      }
      step(t2) {
        return this;
      }
      decimals(t2) {
        return this;
      }
      listen(t2 = true) {
        return this._listening = t2, void 0 !== this._listenCallbackID && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
      }
      _listenCallback() {
        this._listenCallbackID = requestAnimationFrame(this._listenCallback);
        const t2 = this.save();
        t2 !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = t2;
      }
      getValue() {
        return this.object[this.property];
      }
      setValue(t2) {
        return this.getValue() !== t2 && (this.object[this.property] = t2, this._callOnChange(), this.updateDisplay()), this;
      }
      updateDisplay() {
        return this;
      }
      load(t2) {
        return this.setValue(t2), this._callOnFinishChange(), this;
      }
      save() {
        return this.getValue();
      }
      destroy() {
        this.listen(false), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
      }
    };
    var i = class extends t {
      constructor(t2, i2, e2) {
        super(t2, i2, e2, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
          this.setValue(this.$input.checked), this._callOnFinishChange();
        }), this.$disable = this.$input, this.updateDisplay();
      }
      updateDisplay() {
        return this.$input.checked = this.getValue(), this;
      }
    };
    function e(t2) {
      let i2, e2;
      return (i2 = t2.match(/(#|0x)?([a-f0-9]{6})/i)) ? e2 = i2[2] : (i2 = t2.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e2 = parseInt(i2[1]).toString(16).padStart(2, 0) + parseInt(i2[2]).toString(16).padStart(2, 0) + parseInt(i2[3]).toString(16).padStart(2, 0) : (i2 = t2.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e2 = i2[1] + i2[1] + i2[2] + i2[2] + i2[3] + i2[3]), !!e2 && "#" + e2;
    }
    var s = { isPrimitive: true, match: (t2) => "number" == typeof t2, fromHexString: (t2) => parseInt(t2.substring(1), 16), toHexString: (t2) => "#" + t2.toString(16).padStart(6, 0) };
    var n = { isPrimitive: false, match: (t2) => Array.isArray(t2), fromHexString(t2, i2, e2 = 1) {
      const n2 = s.fromHexString(t2);
      i2[0] = (n2 >> 16 & 255) / 255 * e2, i2[1] = (n2 >> 8 & 255) / 255 * e2, i2[2] = (255 & n2) / 255 * e2;
    }, toHexString: ([t2, i2, e2], n2 = 1) => s.toHexString(t2 * (n2 = 255 / n2) << 16 ^ i2 * n2 << 8 ^ e2 * n2 << 0) };
    var l = { isPrimitive: false, match: (t2) => Object(t2) === t2, fromHexString(t2, i2, e2 = 1) {
      const n2 = s.fromHexString(t2);
      i2.r = (n2 >> 16 & 255) / 255 * e2, i2.g = (n2 >> 8 & 255) / 255 * e2, i2.b = (255 & n2) / 255 * e2;
    }, toHexString: ({ r: t2, g: i2, b: e2 }, n2 = 1) => s.toHexString(t2 * (n2 = 255 / n2) << 16 ^ i2 * n2 << 8 ^ e2 * n2 << 0) };
    var r = [{ isPrimitive: true, match: (t2) => "string" == typeof t2, fromHexString: e, toHexString: e }, s, n, l];
    var o = class extends t {
      constructor(t2, i2, s2, n2) {
        var l2;
        super(t2, i2, s2, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = (l2 = this.initialValue, r.find((t3) => t3.match(l2))), this._rgbScale = n2, this._initialValueHexString = this.save(), this._textFocused = false, this.$input.addEventListener("input", () => {
          this._setValueFromHexString(this.$input.value);
        }), this.$input.addEventListener("blur", () => {
          this._callOnFinishChange();
        }), this.$text.addEventListener("input", () => {
          const t3 = e(this.$text.value);
          t3 && this._setValueFromHexString(t3);
        }), this.$text.addEventListener("focus", () => {
          this._textFocused = true, this.$text.select();
        }), this.$text.addEventListener("blur", () => {
          this._textFocused = false, this.updateDisplay(), this._callOnFinishChange();
        }), this.$disable = this.$text, this.updateDisplay();
      }
      reset() {
        return this._setValueFromHexString(this._initialValueHexString), this;
      }
      _setValueFromHexString(t2) {
        if (this._format.isPrimitive) {
          const i2 = this._format.fromHexString(t2);
          this.setValue(i2);
        } else this._format.fromHexString(t2, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
      }
      save() {
        return this._format.toHexString(this.getValue(), this._rgbScale);
      }
      load(t2) {
        return this._setValueFromHexString(t2), this._callOnFinishChange(), this;
      }
      updateDisplay() {
        return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
      }
    };
    var a = class extends t {
      constructor(t2, i2, e2) {
        super(t2, i2, e2, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (t3) => {
          t3.preventDefault(), this.getValue().call(this.object), this._callOnChange();
        }), this.$button.addEventListener("touchstart", () => {
        }, { passive: true }), this.$disable = this.$button;
      }
    };
    var h = class extends t {
      constructor(t2, i2, e2, s2, n2, l2) {
        super(t2, i2, e2, "number"), this._initInput(), this.min(s2), this.max(n2);
        const r2 = void 0 !== l2;
        this.step(r2 ? l2 : this._getImplicitStep(), r2), this.updateDisplay();
      }
      decimals(t2) {
        return this._decimals = t2, this.updateDisplay(), this;
      }
      min(t2) {
        return this._min = t2, this._onUpdateMinMax(), this;
      }
      max(t2) {
        return this._max = t2, this._onUpdateMinMax(), this;
      }
      step(t2, i2 = true) {
        return this._step = t2, this._stepExplicit = i2, this;
      }
      updateDisplay() {
        const t2 = this.getValue();
        if (this._hasSlider) {
          let i2 = (t2 - this._min) / (this._max - this._min);
          i2 = Math.max(0, Math.min(i2, 1)), this.$fill.style.width = 100 * i2 + "%";
        }
        return this._inputFocused || (this.$input.value = void 0 === this._decimals ? t2 : t2.toFixed(this._decimals)), this;
      }
      _initInput() {
        this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id);
        window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
        const t2 = (t3) => {
          const i3 = parseFloat(this.$input.value);
          isNaN(i3) || (this._snapClampSetValue(i3 + t3), this.$input.value = this.getValue());
        };
        let i2, e2, s2, n2, l2, r2 = false;
        const o2 = (t3) => {
          if (r2) {
            const s3 = t3.clientX - i2, n3 = t3.clientY - e2;
            Math.abs(n3) > 5 ? (t3.preventDefault(), this.$input.blur(), r2 = false, this._setDraggingStyle(true, "vertical")) : Math.abs(s3) > 5 && a2();
          }
          if (!r2) {
            const i3 = t3.clientY - s2;
            l2 -= i3 * this._step * this._arrowKeyMultiplier(t3), n2 + l2 > this._max ? l2 = this._max - n2 : n2 + l2 < this._min && (l2 = this._min - n2), this._snapClampSetValue(n2 + l2);
          }
          s2 = t3.clientY;
        }, a2 = () => {
          this._setDraggingStyle(false, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", o2), window.removeEventListener("mouseup", a2);
        };
        this.$input.addEventListener("input", () => {
          let t3 = parseFloat(this.$input.value);
          isNaN(t3) || (this._stepExplicit && (t3 = this._snap(t3)), this.setValue(this._clamp(t3)));
        }), this.$input.addEventListener("keydown", (i3) => {
          "Enter" === i3.key && this.$input.blur(), "ArrowUp" === i3.code && (i3.preventDefault(), t2(this._step * this._arrowKeyMultiplier(i3))), "ArrowDown" === i3.code && (i3.preventDefault(), t2(this._step * this._arrowKeyMultiplier(i3) * -1));
        }), this.$input.addEventListener("wheel", (i3) => {
          this._inputFocused && (i3.preventDefault(), t2(this._step * this._normalizeMouseWheel(i3)));
        }, { passive: false }), this.$input.addEventListener("mousedown", (t3) => {
          i2 = t3.clientX, e2 = s2 = t3.clientY, r2 = true, n2 = this.getValue(), l2 = 0, window.addEventListener("mousemove", o2), window.addEventListener("mouseup", a2);
        }), this.$input.addEventListener("focus", () => {
          this._inputFocused = true;
        }), this.$input.addEventListener("blur", () => {
          this._inputFocused = false, this.updateDisplay(), this._callOnFinishChange();
        });
      }
      _initSlider() {
        this._hasSlider = true, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
        const t2 = (t3) => {
          const i3 = this.$slider.getBoundingClientRect();
          let e3 = (s3 = t3, n3 = i3.left, l3 = i3.right, r3 = this._min, o3 = this._max, (s3 - n3) / (l3 - n3) * (o3 - r3) + r3);
          var s3, n3, l3, r3, o3;
          this._snapClampSetValue(e3);
        }, i2 = (i3) => {
          t2(i3.clientX);
        }, e2 = () => {
          this._callOnFinishChange(), this._setDraggingStyle(false), window.removeEventListener("mousemove", i2), window.removeEventListener("mouseup", e2);
        };
        let s2, n2, l2 = false;
        const r2 = (i3) => {
          i3.preventDefault(), this._setDraggingStyle(true), t2(i3.touches[0].clientX), l2 = false;
        }, o2 = (i3) => {
          if (l2) {
            const t3 = i3.touches[0].clientX - s2, e3 = i3.touches[0].clientY - n2;
            Math.abs(t3) > Math.abs(e3) ? r2(i3) : (window.removeEventListener("touchmove", o2), window.removeEventListener("touchend", a2));
          } else i3.preventDefault(), t2(i3.touches[0].clientX);
        }, a2 = () => {
          this._callOnFinishChange(), this._setDraggingStyle(false), window.removeEventListener("touchmove", o2), window.removeEventListener("touchend", a2);
        }, h2 = this._callOnFinishChange.bind(this);
        let d2;
        this.$slider.addEventListener("mousedown", (s3) => {
          this._setDraggingStyle(true), t2(s3.clientX), window.addEventListener("mousemove", i2), window.addEventListener("mouseup", e2);
        }), this.$slider.addEventListener("touchstart", (t3) => {
          t3.touches.length > 1 || (this._hasScrollBar ? (s2 = t3.touches[0].clientX, n2 = t3.touches[0].clientY, l2 = true) : r2(t3), window.addEventListener("touchmove", o2, { passive: false }), window.addEventListener("touchend", a2));
        }, { passive: false }), this.$slider.addEventListener("wheel", (t3) => {
          if (Math.abs(t3.deltaX) < Math.abs(t3.deltaY) && this._hasScrollBar) return;
          t3.preventDefault();
          const i3 = this._normalizeMouseWheel(t3) * this._step;
          this._snapClampSetValue(this.getValue() + i3), this.$input.value = this.getValue(), clearTimeout(d2), d2 = setTimeout(h2, 400);
        }, { passive: false });
      }
      _setDraggingStyle(t2, i2 = "horizontal") {
        this.$slider && this.$slider.classList.toggle("active", t2), document.body.classList.toggle("lil-gui-dragging", t2), document.body.classList.toggle("lil-gui-" + i2, t2);
      }
      _getImplicitStep() {
        return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
      }
      _onUpdateMinMax() {
        !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), false), this._initSlider(), this.updateDisplay());
      }
      _normalizeMouseWheel(t2) {
        let { deltaX: i2, deltaY: e2 } = t2;
        Math.floor(t2.deltaY) !== t2.deltaY && t2.wheelDelta && (i2 = 0, e2 = -t2.wheelDelta / 120, e2 *= this._stepExplicit ? 1 : 10);
        return i2 + -e2;
      }
      _arrowKeyMultiplier(t2) {
        let i2 = this._stepExplicit ? 1 : 10;
        return t2.shiftKey ? i2 *= 10 : t2.altKey && (i2 /= 10), i2;
      }
      _snap(t2) {
        const i2 = Math.round(t2 / this._step) * this._step;
        return parseFloat(i2.toPrecision(15));
      }
      _clamp(t2) {
        return t2 < this._min && (t2 = this._min), t2 > this._max && (t2 = this._max), t2;
      }
      _snapClampSetValue(t2) {
        this.setValue(this._clamp(this._snap(t2)));
      }
      get _hasScrollBar() {
        const t2 = this.parent.root.$children;
        return t2.scrollHeight > t2.clientHeight;
      }
      get _hasMin() {
        return void 0 !== this._min;
      }
      get _hasMax() {
        return void 0 !== this._max;
      }
    };
    var d = class extends t {
      constructor(t2, i2, e2, s2) {
        super(t2, i2, e2, "option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$select.addEventListener("change", () => {
          this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
        }), this.$select.addEventListener("focus", () => {
          this.$display.classList.add("focus");
        }), this.$select.addEventListener("blur", () => {
          this.$display.classList.remove("focus");
        }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(s2);
      }
      options(t2) {
        return this._values = Array.isArray(t2) ? t2 : Object.values(t2), this._names = Array.isArray(t2) ? t2 : Object.keys(t2), this.$select.replaceChildren(), this._names.forEach((t3) => {
          const i2 = document.createElement("option");
          i2.textContent = t3, this.$select.appendChild(i2);
        }), this.updateDisplay(), this;
      }
      updateDisplay() {
        const t2 = this.getValue(), i2 = this._values.indexOf(t2);
        return this.$select.selectedIndex = i2, this.$display.textContent = -1 === i2 ? t2 : this._names[i2], this;
      }
    };
    var c = class extends t {
      constructor(t2, i2, e2) {
        super(t2, i2, e2, "string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
          this.setValue(this.$input.value);
        }), this.$input.addEventListener("keydown", (t3) => {
          "Enter" === t3.code && this.$input.blur();
        }), this.$input.addEventListener("blur", () => {
          this._callOnFinishChange();
        }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
      }
      updateDisplay() {
        return this.$input.value = this.getValue(), this;
      }
    };
    var u = false;
    var p = class _p {
      constructor({ parent: t2, autoPlace: i2 = void 0 === t2, container: e2, width: s2, title: n2 = "Controls", closeFolders: l2 = false, injectStyles: r2 = true, touchStyles: o2 = true } = {}) {
        if (this.parent = t2, this.root = t2 ? t2.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = false, this._hidden = false, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("div"), this.$title.classList.add("title"), this.$title.setAttribute("role", "button"), this.$title.setAttribute("aria-expanded", true), this.$title.setAttribute("tabindex", 0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("keydown", (t3) => {
          "Enter" !== t3.code && "Space" !== t3.code || (t3.preventDefault(), this.$title.click());
        }), this.$title.addEventListener("touchstart", () => {
        }, { passive: true }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(n2), this.parent) return this.parent.children.push(this), this.parent.folders.push(this), void this.parent.$children.appendChild(this.domElement);
        this.domElement.classList.add("root"), o2 && this.domElement.classList.add("allow-touch-styles"), !u && r2 && (!(function(t3) {
          const i3 = document.createElement("style");
          i3.innerHTML = t3;
          const e3 = document.querySelector("head link[rel=stylesheet], head style");
          e3 ? document.head.insertBefore(i3, e3) : document.head.appendChild(i3);
        })('.lil-gui{--background-color:#1f1f1f;--text-color:#ebebeb;--title-background-color:#111;--title-text-color:#ebebeb;--widget-color:#424242;--hover-color:#4f4f4f;--focus-color:#595959;--number-color:#2cc9ff;--string-color:#a2db3c;--font-size:11px;--input-font-size:11px;--font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;--font-family-mono:Menlo,Monaco,Consolas,"Droid Sans Mono",monospace;--padding:4px;--spacing:4px;--widget-height:20px;--title-height:calc(var(--widget-height) + var(--spacing)*1.25);--name-width:45%;--slider-knob-width:2px;--slider-input-width:27%;--color-input-width:27%;--slider-input-min-width:45px;--color-input-min-width:45px;--folder-indent:7px;--widget-padding:0 0 0 3px;--widget-border-radius:2px;--checkbox-size:calc(var(--widget-height)*0.75);--scrollbar-width:5px;color:var(--text-color);font-family:var(--font-family);font-size:var(--font-size);font-style:normal;font-weight:400;line-height:1;text-align:left;touch-action:manipulation;user-select:none;-webkit-user-select:none}.lil-gui,.lil-gui *{box-sizing:border-box;margin:0;padding:0}.lil-gui.root{background:var(--background-color);display:flex;flex-direction:column;width:var(--width,245px)}.lil-gui.root>.title{background:var(--title-background-color);color:var(--title-text-color)}.lil-gui.root>.children{overflow-x:hidden;overflow-y:auto}.lil-gui.root>.children::-webkit-scrollbar{background:var(--background-color);height:var(--scrollbar-width);width:var(--scrollbar-width)}.lil-gui.root>.children::-webkit-scrollbar-thumb{background:var(--focus-color);border-radius:var(--scrollbar-width)}.lil-gui.force-touch-styles,.lil-gui.force-touch-styles .lil-gui{--widget-height:28px;--padding:6px;--spacing:6px;--font-size:13px;--input-font-size:16px;--folder-indent:10px;--scrollbar-width:7px;--slider-input-min-width:50px;--color-input-min-width:65px}.lil-gui.autoPlace{max-height:100%;position:fixed;right:15px;top:0;z-index:1001}.lil-gui .controller{align-items:center;display:flex;margin:var(--spacing) 0;padding:0 var(--padding)}.lil-gui .controller.disabled{opacity:.5}.lil-gui .controller.disabled,.lil-gui .controller.disabled *{pointer-events:none!important}.lil-gui .controller>.name{flex-shrink:0;line-height:var(--widget-height);min-width:var(--name-width);padding-right:var(--spacing);white-space:pre}.lil-gui .controller .widget{align-items:center;display:flex;min-height:var(--widget-height);position:relative;width:100%}.lil-gui .controller.string input{color:var(--string-color)}.lil-gui .controller.boolean{cursor:pointer}.lil-gui .controller.color .display{border-radius:var(--widget-border-radius);height:var(--widget-height);position:relative;width:100%}.lil-gui .controller.color input[type=color]{cursor:pointer;height:100%;opacity:0;width:100%}.lil-gui .controller.color input[type=text]{flex-shrink:0;font-family:var(--font-family-mono);margin-left:var(--spacing);min-width:var(--color-input-min-width);width:var(--color-input-width)}.lil-gui .controller.option select{max-width:100%;opacity:0;position:absolute;width:100%}.lil-gui .controller.option .display{background:var(--widget-color);border-radius:var(--widget-border-radius);height:var(--widget-height);line-height:var(--widget-height);max-width:100%;overflow:hidden;padding-left:.55em;padding-right:1.75em;pointer-events:none;position:relative;word-break:break-all}.lil-gui .controller.option .display.active{background:var(--focus-color)}.lil-gui .controller.option .display:after{bottom:0;content:"\u2195";font-family:lil-gui;padding-right:.375em;position:absolute;right:0;top:0}.lil-gui .controller.option .widget,.lil-gui .controller.option select{cursor:pointer}.lil-gui .controller.number input{color:var(--number-color)}.lil-gui .controller.number.hasSlider input{flex-shrink:0;margin-left:var(--spacing);min-width:var(--slider-input-min-width);width:var(--slider-input-width)}.lil-gui .controller.number .slider{background:var(--widget-color);border-radius:var(--widget-border-radius);cursor:ew-resize;height:var(--widget-height);overflow:hidden;padding-right:var(--slider-knob-width);touch-action:pan-y;width:100%}.lil-gui .controller.number .slider.active{background:var(--focus-color)}.lil-gui .controller.number .slider.active .fill{opacity:.95}.lil-gui .controller.number .fill{border-right:var(--slider-knob-width) solid var(--number-color);box-sizing:content-box;height:100%}.lil-gui-dragging .lil-gui{--hover-color:var(--widget-color)}.lil-gui-dragging *{cursor:ew-resize!important}.lil-gui-dragging.lil-gui-vertical *{cursor:ns-resize!important}.lil-gui .title{-webkit-tap-highlight-color:transparent;text-decoration-skip:objects;cursor:pointer;font-weight:600;height:var(--title-height);line-height:calc(var(--title-height) - 4px);outline:none;padding:0 var(--padding)}.lil-gui .title:before{content:"\u25BE";display:inline-block;font-family:lil-gui;padding-right:2px}.lil-gui .title:active{background:var(--title-background-color);opacity:.75}.lil-gui.root>.title:focus{text-decoration:none!important}.lil-gui.closed>.title:before{content:"\u25B8"}.lil-gui.closed>.children{opacity:0;transform:translateY(-7px)}.lil-gui.closed:not(.transition)>.children{display:none}.lil-gui.transition>.children{overflow:hidden;pointer-events:none;transition-duration:.3s;transition-property:height,opacity,transform;transition-timing-function:cubic-bezier(.2,.6,.35,1)}.lil-gui .children:empty:before{content:"Empty";display:block;font-style:italic;height:var(--widget-height);line-height:var(--widget-height);margin:var(--spacing) 0;opacity:.5;padding:0 var(--padding)}.lil-gui.root>.children>.lil-gui>.title{border-width:0;border-bottom:1px solid var(--widget-color);border-left:0 solid var(--widget-color);border-right:0 solid var(--widget-color);border-top:1px solid var(--widget-color);transition:border-color .3s}.lil-gui.root>.children>.lil-gui.closed>.title{border-bottom-color:transparent}.lil-gui+.controller{border-top:1px solid var(--widget-color);margin-top:0;padding-top:var(--spacing)}.lil-gui .lil-gui .lil-gui>.title{border:none}.lil-gui .lil-gui .lil-gui>.children{border:none;border-left:2px solid var(--widget-color);margin-left:var(--folder-indent)}.lil-gui .lil-gui .controller{border:none}.lil-gui button,.lil-gui input,.lil-gui label{-webkit-tap-highlight-color:transparent}.lil-gui input{background:var(--widget-color);border:0;border-radius:var(--widget-border-radius);color:var(--text-color);font-family:var(--font-family);font-size:var(--input-font-size);height:var(--widget-height);outline:none;width:100%}.lil-gui input:disabled{opacity:1}.lil-gui input[type=number],.lil-gui input[type=text]{-moz-appearance:textfield;padding:var(--widget-padding)}.lil-gui input[type=number]:focus,.lil-gui input[type=text]:focus{background:var(--focus-color)}.lil-gui input[type=checkbox]{appearance:none;border-radius:var(--widget-border-radius);cursor:pointer;height:var(--checkbox-size);text-align:center;width:var(--checkbox-size)}.lil-gui input[type=checkbox]:checked:before{content:"\u2713";font-family:lil-gui;font-size:var(--checkbox-size);line-height:var(--checkbox-size)}.lil-gui button{background:var(--widget-color);border:none;border-radius:var(--widget-border-radius);color:var(--text-color);cursor:pointer;font-family:var(--font-family);font-size:var(--font-size);height:var(--widget-height);outline:none;text-transform:none;width:100%}.lil-gui button:active{background:var(--focus-color)}@font-face{font-family:lil-gui;src:url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff")}@media (pointer:coarse){.lil-gui.allow-touch-styles,.lil-gui.allow-touch-styles .lil-gui{--widget-height:28px;--padding:6px;--spacing:6px;--font-size:13px;--input-font-size:16px;--folder-indent:10px;--scrollbar-width:7px;--slider-input-min-width:50px;--color-input-min-width:65px}}@media (hover:hover){.lil-gui .controller.color .display:hover:before{border:1px solid #fff9;border-radius:var(--widget-border-radius);bottom:0;content:" ";display:block;left:0;position:absolute;right:0;top:0}.lil-gui .controller.option .display.focus{background:var(--focus-color)}.lil-gui .controller.number .slider:hover,.lil-gui .controller.option .widget:hover .display{background:var(--hover-color)}body:not(.lil-gui-dragging) .lil-gui .title:hover{background:var(--title-background-color);opacity:.85}.lil-gui .title:focus{text-decoration:underline var(--focus-color)}.lil-gui input:hover{background:var(--hover-color)}.lil-gui input:active{background:var(--focus-color)}.lil-gui input[type=checkbox]:focus{box-shadow:inset 0 0 0 1px var(--focus-color)}.lil-gui button:hover{background:var(--hover-color)}.lil-gui button:focus{box-shadow:inset 0 0 0 1px var(--focus-color)}}'), u = true), e2 ? e2.appendChild(this.domElement) : i2 && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), s2 && this.domElement.style.setProperty("--width", s2 + "px"), this._closeFolders = l2;
      }
      add(t2, e2, s2, n2, l2) {
        if (Object(s2) === s2) return new d(this, t2, e2, s2);
        const r2 = t2[e2];
        switch (typeof r2) {
          case "number":
            return new h(this, t2, e2, s2, n2, l2);
          case "boolean":
            return new i(this, t2, e2);
          case "string":
            return new c(this, t2, e2);
          case "function":
            return new a(this, t2, e2);
        }
        console.error("gui.add failed\n	property:", e2, "\n	object:", t2, "\n	value:", r2);
      }
      addColor(t2, i2, e2 = 1) {
        return new o(this, t2, i2, e2);
      }
      addFolder(t2) {
        const i2 = new _p({ parent: this, title: t2 });
        return this.root._closeFolders && i2.close(), i2;
      }
      load(t2, i2 = true) {
        return t2.controllers && this.controllers.forEach((i3) => {
          i3 instanceof a || i3._name in t2.controllers && i3.load(t2.controllers[i3._name]);
        }), i2 && t2.folders && this.folders.forEach((i3) => {
          i3._title in t2.folders && i3.load(t2.folders[i3._title]);
        }), this;
      }
      save(t2 = true) {
        const i2 = { controllers: {}, folders: {} };
        return this.controllers.forEach((t3) => {
          if (!(t3 instanceof a)) {
            if (t3._name in i2.controllers) throw new Error(`Cannot save GUI with duplicate property "${t3._name}"`);
            i2.controllers[t3._name] = t3.save();
          }
        }), t2 && this.folders.forEach((t3) => {
          if (t3._title in i2.folders) throw new Error(`Cannot save GUI with duplicate folder "${t3._title}"`);
          i2.folders[t3._title] = t3.save();
        }), i2;
      }
      open(t2 = true) {
        return this._setClosed(!t2), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("closed", this._closed), this;
      }
      close() {
        return this.open(false);
      }
      _setClosed(t2) {
        this._closed !== t2 && (this._closed = t2, this._callOnOpenClose(this));
      }
      show(t2 = true) {
        return this._hidden = !t2, this.domElement.style.display = this._hidden ? "none" : "", this;
      }
      hide() {
        return this.show(false);
      }
      openAnimated(t2 = true) {
        return this._setClosed(!t2), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
          const i2 = this.$children.clientHeight;
          this.$children.style.height = i2 + "px", this.domElement.classList.add("transition");
          const e2 = (t3) => {
            t3.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", e2));
          };
          this.$children.addEventListener("transitionend", e2);
          const s2 = t2 ? this.$children.scrollHeight : 0;
          this.domElement.classList.toggle("closed", !t2), requestAnimationFrame(() => {
            this.$children.style.height = s2 + "px";
          });
        }), this;
      }
      title(t2) {
        return this._title = t2, this.$title.textContent = t2, this;
      }
      reset(t2 = true) {
        return (t2 ? this.controllersRecursive() : this.controllers).forEach((t3) => t3.reset()), this;
      }
      onChange(t2) {
        return this._onChange = t2, this;
      }
      _callOnChange(t2) {
        this.parent && this.parent._callOnChange(t2), void 0 !== this._onChange && this._onChange.call(this, { object: t2.object, property: t2.property, value: t2.getValue(), controller: t2 });
      }
      onFinishChange(t2) {
        return this._onFinishChange = t2, this;
      }
      _callOnFinishChange(t2) {
        this.parent && this.parent._callOnFinishChange(t2), void 0 !== this._onFinishChange && this._onFinishChange.call(this, { object: t2.object, property: t2.property, value: t2.getValue(), controller: t2 });
      }
      onOpenClose(t2) {
        return this._onOpenClose = t2, this;
      }
      _callOnOpenClose(t2) {
        this.parent && this.parent._callOnOpenClose(t2), void 0 !== this._onOpenClose && this._onOpenClose.call(this, t2);
      }
      destroy() {
        this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((t2) => t2.destroy());
      }
      controllersRecursive() {
        let t2 = Array.from(this.controllers);
        return this.folders.forEach((i2) => {
          t2 = t2.concat(i2.controllersRecursive());
        }), t2;
      }
      foldersRecursive() {
        let t2 = Array.from(this.folders);
        return this.folders.forEach((i2) => {
          t2 = t2.concat(i2.foldersRecursive());
        }), t2;
      }
    };
    var lil_gui_esm_min_default = p;
    var canvas = document.getElementById("scene");
    var ctx = canvas.getContext("2d");
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var source = { x: 0, y: 0, radius: 36 };
    var photons = [];
    var measurements = [];
    var collisions = [];
    var camera = { x: 0, y: 0, scale: 1 };
    var spawnLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    var spawnLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    var electron = {
      x: 120,
      y: 160,
      vx: 160,
      vy: 0,
      radius: 11,
      trail: []
    };
    var params = {
      wavelength: 520,
      // nm
      autoFire: false,
      fireRate: 1.5,
      // photons per second
      beamSpread: 70,
      // (unused for aim now; kept for UI compatibility)
      photonSpeed: 520,
      // px/s
      kickMultiplier: 1,
      timeScale: 0.8,
      showVectors: true,
      showTrails: false,
      showResolutionSpot: true,
      paused: false,
      pauseOnCollision: false,
      applyPresetBase: () => applyPreset("base"),
      applyPresetOne: () => applyPreset("preset1"),
      slowMotionPreset: () => params.timeScale = 0.22,
      resetSpeedPreset: () => params.timeScale = 0.8,
      pulseOnce: () => emitPhoton(true),
      resetElectron: () => resetElectron(),
      electronMass: 1,
      electronSpeed: 170,
      drag: 0.02
    };
    var gui = new lil_gui_esm_min_default();
    gui.title("Controls");
    gui.add(params, "wavelength", 220, 720, 1).name("Photon \u03BB (nm)");
    gui.add(params, "fireRate", 0.2, 8, 0.1).name("Auto fire rate");
    gui.add(params, "autoFire").name("Auto fire");
    gui.add(params, "beamSpread", 10, 160, 1).name("Beam spread (auto-aim on)");
    gui.add(params, "kickMultiplier", 0.5, 2.5, 0.01).name("Kick scale");
    gui.add(params, "electronMass", 0.4, 3, 0.01).name("Electron mass");
    gui.add(params, "electronSpeed", 20, 400, 1).name("Electron speed");
    gui.add(params, "timeScale", 0.05, 1.5, 0.01).name("Simulation speed");
    gui.add(params, "paused").name("Pause simulation");
    gui.add(params, "pauseOnCollision").name("Pause on collision");
    gui.add(params, "applyPresetBase").name("Preset: Base");
    gui.add(params, "applyPresetOne").name("Preset: High energy pause");
    gui.add(params, "slowMotionPreset").name("Preset: Slow mo");
    gui.add(params, "resetSpeedPreset").name("Preset: Normal");
    gui.add(params, "showVectors").name("Show vectors");
    gui.add(params, "showTrails").name("Show trails");
    gui.add(params, "showResolutionSpot").name("Show spot size");
    gui.add(params, "pulseOnce").name("Emit once");
    gui.add(params, "resetElectron").name("Reset electron");
    var state = {
      lastTime: performance.now(),
      accumulator: 0,
      emissionAccumulator: 0
    };
    var isPanning = false;
    var lastPan = { x: 0, y: 0 };
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      source.x = width * 0.5;
      source.y = height * 0.85;
      spawnLine.end.x = width + 60;
    }
    function lerp(a2, b, t2) {
      return a2 + (b - a2) * t2;
    }
    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }
    function map(value, inMin, inMax, outMin, outMax) {
      const t2 = (value - inMin) / (inMax - inMin);
      return lerp(outMin, outMax, clamp(t2, 0, 1));
    }
    function screenToWorld(sx, sy) {
      return {
        x: (sx - camera.x) / camera.scale,
        y: (sy - camera.y) / camera.scale
      };
    }
    function worldToScreen(wx, wy) {
      return {
        x: wx * camera.scale + camera.x,
        y: wy * camera.scale + camera.y
      };
    }
    function screenToWorld(sx, sy) {
      return {
        x: (sx - camera.x) / camera.scale,
        y: (sy - camera.y) / camera.scale
      };
    }
    function randomGaussian() {
      let u2 = 0;
      let v = 0;
      while (u2 === 0) u2 = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u2)) * Math.cos(2 * Math.PI * v);
    }
    function wavelengthToColor(lambda) {
      const wave = clamp(lambda, 380, 700);
      let r2 = 0;
      let g = 0;
      let b = 0;
      if (wave >= 380 && wave < 440) {
        r2 = -(wave - 440) / (440 - 380);
        g = 0;
        b = 1;
      } else if (wave >= 440 && wave < 490) {
        r2 = 0;
        g = (wave - 440) / (490 - 440);
        b = 1;
      } else if (wave >= 490 && wave < 510) {
        r2 = 0;
        g = 1;
        b = -(wave - 510) / (510 - 490);
      } else if (wave >= 510 && wave < 580) {
        r2 = (wave - 510) / (580 - 510);
        g = 1;
        b = 0;
      } else if (wave >= 580 && wave < 645) {
        r2 = 1;
        g = -(wave - 645) / (645 - 580);
        b = 0;
      } else if (wave >= 645 && wave <= 700) {
        r2 = 1;
        g = 0;
        b = 0;
      }
      const factor = wave >= 380 && wave < 420 ? 0.3 + 0.7 * (wave - 380) / 40 : wave >= 645 && wave <= 700 ? 0.3 + 0.7 * (700 - wave) / 55 : 1;
      r2 = Math.pow(r2 * factor, 0.9);
      g = Math.pow(g * factor, 0.9);
      b = Math.pow(b * factor, 0.9);
      const to255 = (v) => Math.round(v * 255);
      return `rgb(${to255(r2)}, ${to255(g)}, ${to255(b)})`;
    }
    function energyFromWavelength(lambda) {
      const min = 220;
      const max = 720;
      const t2 = clamp((max - lambda) / (max - min), 0, 1);
      return 0.5 + t2 * 2.4;
    }
    function resolutionFromWavelength(lambda) {
      const minSpot = 6;
      const maxSpot = 38;
      const t2 = clamp((lambda - 220) / (720 - 220), 0, 1);
      return lerp(minSpot, maxSpot, t2);
    }
    function resetElectron() {
      electron.x = width * 0.18;
      electron.y = height * 0.35;
      electron.vx = params.electronSpeed;
      electron.vy = 0;
      electron.trail.length = 0;
      spawnLine.start = { x: electron.x, y: electron.y };
      spawnLine.end = { x: width + 60, y: electron.y };
    }
    function applyPreset(name) {
      if (name === "base") {
        params.wavelength = 520;
        params.autoFire = false;
        params.fireRate = 1.5;
        params.pauseOnCollision = false;
        params.timeScale = 0.8;
      } else if (name === "preset1") {
        params.wavelength = 220;
        params.autoFire = false;
        params.pauseOnCollision = true;
        params.fireRate = 1.5;
        params.timeScale = 0.8;
      }
      resetElectron();
      state.emissionAccumulator = 0;
    }
    function interceptDirection(shooter, target, targetVel, projectileSpeed) {
      const rx = target.x - shooter.x;
      const ry = target.y - shooter.y;
      const r2 = rx * rx + ry * ry;
      const v2 = targetVel.vx * targetVel.vx + targetVel.vy * targetVel.vy;
      const rv = rx * targetVel.vx + ry * targetVel.vy;
      const s2 = projectileSpeed * projectileSpeed;
      const a2 = v2 - s2;
      const b = 2 * rv;
      const c2 = r2;
      let t2;
      if (Math.abs(a2) < 1e-6) {
        t2 = -c2 / b;
      } else {
        const disc = b * b - 4 * a2 * c2;
        if (disc < 0) {
          t2 = -1;
        } else {
          const sqrt = Math.sqrt(disc);
          const t1 = (-b - sqrt) / (2 * a2);
          const t22 = (-b + sqrt) / (2 * a2);
          t2 = Math.min(t1, t22) > 0 ? Math.min(t1, t22) : Math.max(t1, t22);
        }
      }
      if (!isFinite(t2) || t2 <= 0) {
        const len2 = Math.hypot(rx, ry) || 1;
        return { dx: rx / len2, dy: ry / len2, t: Math.max(len2 / projectileSpeed, 0.01) };
      }
      const aimX = rx + targetVel.vx * t2;
      const aimY = ry + targetVel.vy * t2;
      const len = Math.hypot(aimX, aimY) || 1;
      return { dx: aimX / len, dy: aimY / len, t: t2 };
    }
    function emitPhoton(manual = false) {
      const lambda = params.wavelength;
      const energy = energyFromWavelength(lambda) * params.kickMultiplier;
      const dirResult = interceptDirection(
        { x: source.x, y: source.y },
        { x: electron.x, y: electron.y },
        { vx: electron.vx, vy: electron.vy },
        params.photonSpeed
      );
      let dir = dirResult;
      const jitterScale = clamp((params.wavelength - 320) / 400, 0, 1);
      const sigma = params.beamSpread * jitterScale;
      if (sigma > 0.01) {
        const predictedHitX = source.x + dir.dx * params.photonSpeed * dir.t;
        const predictedHitY = source.y + dir.dy * params.photonSpeed * dir.t;
        const jitterX = randomGaussian() * sigma;
        const jitterY = randomGaussian() * sigma * 0.3;
        const aimX = predictedHitX + jitterX;
        const aimY = predictedHitY + jitterY;
        const offsetX = aimX - source.x;
        const offsetY = aimY - source.y;
        const len = Math.hypot(offsetX, offsetY) || 1;
        dir = { dx: offsetX / len, dy: offsetY / len, t: len / params.photonSpeed };
      }
      const impactDist = Math.max(dir.t * params.photonSpeed, 40);
      const waveAmp = map(lambda, 220, 720, 4, 10);
      const normal = { x: -dir.dy, y: dir.dx };
      const visualLambda = map(lambda, 220, 720, 22, 70);
      photons.push({
        x: source.x,
        y: source.y,
        baseX: source.x,
        baseY: source.y,
        dx: dir.dx,
        dy: dir.dy,
        speed: params.photonSpeed,
        lambda,
        energy,
        color: wavelengthToColor(lambda),
        phase: Math.random() * Math.PI * 2,
        age: 0,
        collided: false,
        resolution: resolutionFromWavelength(lambda),
        amplitude: waveAmp,
        nx: normal.x,
        ny: normal.y,
        distTraveled: 0,
        impactDist,
        visualLambda
      });
    }
    function handleCollision(photon) {
      const before = { vx: electron.vx, vy: electron.vy };
      const photonP = { x: photon.dx * photon.energy, y: photon.dy * photon.energy };
      const scatterAngle = (Math.random() - 0.5) * (Math.PI / 4) * (0.7 + photon.energy * 0.15);
      const cosA = Math.cos(scatterAngle);
      const sinA = Math.sin(scatterAngle);
      const afterDir = {
        x: photon.dx * cosA - photon.dy * sinA,
        y: photon.dx * sinA + photon.dy * cosA
      };
      const photonAfterEnergy = photon.energy * 0.25;
      const photonAfterP = { x: afterDir.x * photonAfterEnergy, y: afterDir.y * photonAfterEnergy };
      const impulse = {
        x: photonP.x - photonAfterP.x,
        y: photonP.y - photonAfterP.y
      };
      const jitter = (Math.random() - 0.5) * photon.energy * 0.25;
      const perp = { x: -photon.dy, y: photon.dx };
      impulse.x += perp.x * jitter;
      impulse.y += perp.y * jitter;
      const intensity = 2;
      electron.vx += impulse.x * intensity / params.electronMass;
      electron.vy += impulse.y * intensity / params.electronMass;
      collisions.length = 0;
      collisions.push({
        x: electron.x,
        y: electron.y,
        electronBefore: before,
        electronAfter: { vx: electron.vx, vy: electron.vy },
        photonBefore: photonP,
        photonAfter: photonAfterP,
        ttl: 4.2,
        color: photon.color
      });
      if (params.pauseOnCollision) {
        params.paused = true;
      }
    }
    function update(dt) {
      electron.x += electron.vx * dt;
      electron.y += electron.vy * dt;
      const drag = 1 - params.drag * dt;
      electron.vx *= drag;
      electron.vy *= drag;
      const speed = Math.hypot(electron.vx, electron.vy);
      if (speed > 900) {
        const s2 = 900 / speed;
        electron.vx *= s2;
        electron.vy *= s2;
      }
      const offscreen = electron.x < -electron.radius || electron.x > width + electron.radius || electron.y < -electron.radius || electron.y > height + electron.radius;
      if (offscreen) {
        resetElectron();
      }
      if (params.showTrails) {
        electron.trail.unshift({ x: electron.x, y: electron.y });
        if (electron.trail.length > 300) electron.trail.pop();
      } else if (electron.trail.length) {
        electron.trail.length = 0;
      }
      for (let i2 = photons.length - 1; i2 >= 0; i2--) {
        const p2 = photons[i2];
        p2.age += dt;
        p2.phase += dt * 12;
        if (!p2.collided) {
          p2.baseX += p2.dx * p2.speed * dt;
          p2.baseY += p2.dy * p2.speed * dt;
          p2.distTraveled += p2.speed * dt;
          const offset = Math.sin(p2.distTraveled / p2.visualLambda * Math.PI * 2 + p2.phase) * p2.amplitude;
          p2.x = p2.baseX + p2.nx * offset;
          p2.y = p2.baseY + p2.ny * offset;
          const dx = p2.x - electron.x;
          const dy = p2.y - electron.y;
          const dist = Math.hypot(dx, dy);
          const interaction = electron.radius + map(p2.lambda, 220, 720, 16, 6);
          if (dist < interaction) {
            p2.collided = true;
            handleCollision(p2);
            if (params.pauseOnCollision) {
              p2.speed = 0;
              p2.stickUntilResume = true;
              p2.postTTL = 0.6;
            } else {
              photons.splice(i2, 1);
              continue;
            }
          } else if (dist < interaction * 1.8) {
            p2.nearMiss = true;
            p2.nearMissDist = Math.min(p2.nearMissDist || Infinity, dist);
          }
          if (p2.x < -80 || p2.x > width + 80 || p2.y < -120 || p2.y > height + 120) {
            photons.splice(i2, 1);
          }
        } else {
          if (p2.stickUntilResume && !params.paused) {
            photons.splice(i2, 1);
            continue;
          }
          if (p2.postTTL !== void 0) {
            p2.postTTL -= dt;
            if (p2.postTTL <= 0) {
              photons.splice(i2, 1);
            }
          }
        }
      }
      for (let i2 = measurements.length - 1; i2 >= 0; i2--) {
        measurements[i2].ttl -= dt;
        if (measurements[i2].ttl <= 0) measurements.splice(i2, 1);
      }
      for (let i2 = collisions.length - 1; i2 >= 0; i2--) {
        collisions[i2].ttl -= dt;
        if (collisions[i2].ttl <= 0) collisions.splice(i2, 1);
      }
    }
    function drawBackdrop() {
      ctx.fillStyle = "#050b12";
      ctx.fillRect(0, 0, width, height);
    }
    function drawGrid() {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "#0e2337";
      const step = 60;
      for (let x = -width; x < width * 2; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -height; y < height * 2; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawTrail() {
      if (!params.showTrails) return;
      ctx.save();
      ctx.strokeStyle = "rgba(100, 242, 208, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i2 = 0; i2 < electron.trail.length; i2++) {
        const p2 = electron.trail[i2];
        if (i2 === 0) ctx.moveTo(p2.x, p2.y);
        else ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();
      ctx.restore();
    }
    function drawElectron() {
      ctx.save();
      const gradient = ctx.createRadialGradient(electron.x, electron.y, 4, electron.x, electron.y, 18);
      gradient.addColorStop(0, "#9bf6ff");
      gradient.addColorStop(1, "rgba(155,246,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e8fff8";
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, electron.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    function drawProjection() {
      const start = spawnLine.start;
      const end = spawnLine.end;
      if (!start || !end) return;
      ctx.save();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      const angle = 0;
      const ah = 10;
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - ah * Math.cos(angle - Math.PI / 6), end.y - ah * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(end.x - ah * Math.cos(angle + Math.PI / 6), end.y - ah * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();
      ctx.setLineDash([]);
      ctx.restore();
    }
    function drawPhotons() {
      photons.forEach((p2) => {
        const normal = { x: p2.nx, y: p2.ny };
        const waveAmp = p2.amplitude;
        ctx.save();
        ctx.lineWidth = map(p2.lambda, 220, 720, 1.6, 3.6);
        ctx.strokeStyle = p2.color;
        ctx.shadowColor = p2.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const segments = 22;
        const spacing = 8;
        for (let i2 = 0; i2 <= segments; i2++) {
          const t2 = i2 * spacing;
          const baseX = p2.baseX - p2.dx * t2;
          const baseY = p2.baseY - p2.dy * t2;
          const distAlong = Math.max(p2.distTraveled - t2, 0);
          const offset = Math.sin(distAlong / p2.visualLambda * Math.PI * 2 + p2.phase) * waveAmp;
          const wx = baseX + normal.x * offset;
          const wy = baseY + normal.y * offset;
          if (i2 === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = p2.color;
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 4, 0, Math.PI * 2);
        ctx.fill();
        if (p2.nearMiss && !p2.collided) {
          ctx.globalAlpha = 0.4;
          ctx.strokeStyle = p2.color;
          ctx.lineWidth = 1.5;
          const missRadius = Math.max(electron.radius + 10, p2.nearMissDist || 18);
          ctx.beginPath();
          ctx.setLineDash([6, 4]);
          ctx.arc(electron.x, electron.y, missRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
      });
    }
    function drawMeasurements() {
      if (!params.showResolutionSpot) return;
      measurements.forEach((m) => {
        ctx.save();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = clamp(m.ttl, 0, 1);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }
    function drawVectors() {
      if (!params.showVectors) return;
      collisions.forEach((c2) => {
        const alpha = clamp(c2.ttl / 4.2, 0, 1);
        const drawArrow = (vx, vy, color, label, scale = 24) => {
          const endWorld = { x: c2.x + vx * scale, y: c2.y + vy * scale };
          const origin = worldToScreen(c2.x, c2.y);
          const end = worldToScreen(endWorld.x, endWorld.y);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          const angle = Math.atan2(end.y - origin.y, end.x - origin.x);
          const ah = 9;
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(end.x - ah * Math.cos(angle - Math.PI / 6), end.y - ah * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(end.x - ah * Math.cos(angle + Math.PI / 6), end.y - ah * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();
          if (label) {
            ctx.font = "11px Space Grotesk";
            ctx.fillStyle = color;
            ctx.strokeStyle = "rgba(0,0,0,0.35)";
            ctx.lineWidth = 3;
            ctx.strokeText(label, end.x + 6, end.y + 4);
            ctx.fillText(label, end.x + 6, end.y + 4);
          }
          ctx.restore();
        };
        drawArrow(c2.photonBefore.x, c2.photonBefore.y, "#7de2ff", "photon in", 26);
        drawArrow(c2.photonAfter.x, c2.photonAfter.y, "#ffa94d", "photon out", 44);
        drawArrow(c2.electronBefore.vx, c2.electronBefore.vy, "#91f2a6", "electron before", 1.125);
        drawArrow(c2.electronAfter.vx, c2.electronAfter.vy, "#ff6b9a", "electron after", 1.125);
      });
    }
    function drawSource() {
      ctx.save();
      const grad = ctx.createRadialGradient(source.x, source.y, 4, source.x, source.y, 28);
      grad.addColorStop(0, "#ffe79b");
      grad.addColorStop(1, "rgba(255,231,155,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(source.x, source.y, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,231,155,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(source.x, source.y, source.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#f7c266";
      ctx.beginPath();
      ctx.arc(source.x, source.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "12px Space Grotesk";
      ctx.fillStyle = "#e8f3ff";
      ctx.textAlign = "center";
      ctx.fillText("Light source", source.x, source.y + 48);
      ctx.restore();
    }
    function drawHUD() {
      const lambda = params.wavelength;
      const res = resolutionFromWavelength(lambda);
      const energy = energyFromWavelength(lambda) * params.kickMultiplier;
      const barW = 160;
      const posPrecision = clamp((38 - res) / 32, 0, 1);
      const disturbance = clamp((energy - 0.35) / 2.05, 0, 1);
      const hudX = 16;
      const hudY = height - 130;
      ctx.save();
      ctx.fillStyle = "rgba(5,10,18,0.65)";
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, 230, 130, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#eaf3ff";
      ctx.font = "13px Space Grotesk";
      ctx.textAlign = "left";
      ctx.fillText(`\u03BB: ${lambda.toFixed(0)} nm`, hudX + 10, hudY + 22);
      ctx.fillText(`Resolution ~ ${res.toFixed(0)} px`, hudX + 10, hudY + 40);
      ctx.fillText(`Kick ~ ${energy.toFixed(2)} p`, hudX + 10, hudY + 58);
      const drawBar = (y, value, color) => {
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fillRect(hudX + 10, y, barW, 8);
        ctx.fillStyle = color;
        ctx.fillRect(hudX + 10, y, barW * value, 8);
      };
      drawBar(hudY + 78, posPrecision, "#7de2ff");
      drawBar(hudY + 102, disturbance, "#ff9f6b");
      ctx.fillStyle = "#9fb8d6";
      ctx.font = "11px Space Grotesk";
      ctx.fillText("position precision", hudX + 10, hudY + 74);
      ctx.fillText("momentum disturbance", hudX + 10, hudY + 98);
      ctx.restore();
    }
    function render() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBackdrop();
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.scale, camera.scale);
      drawGrid();
      drawSource();
      drawTrail();
      drawMeasurements();
      drawElectron();
      drawProjection();
      drawPhotons();
      ctx.restore();
      drawHUD();
      drawVectors();
    }
    function loop() {
      const now = performance.now();
      const rawDt = (now - state.lastTime) / 1e3;
      state.lastTime = now;
      if (params.paused) {
        render();
        requestAnimationFrame(loop);
        return;
      }
      const dt = rawDt * params.timeScale;
      state.emissionAccumulator += dt;
      const interval = 1 / params.fireRate;
      if (params.autoFire && state.emissionAccumulator >= interval) {
        emitPhoton();
        state.emissionAccumulator = 0;
      }
      update(dt);
      render();
      requestAnimationFrame(loop);
    }
    canvas.addEventListener("click", (e2) => {
      const rect = canvas.getBoundingClientRect();
      const sx = e2.clientX - rect.left;
      const sy = e2.clientY - rect.top;
      const { x, y } = screenToWorld(sx, sy);
      const d2 = Math.hypot(x - source.x, y - source.y);
      if (d2 <= source.radius + 8) {
        emitPhoton(true);
      }
    });
    canvas.addEventListener("pointerdown", (e2) => {
      if (e2.button === 0 || e2.altKey) {
        isPanning = true;
        lastPan = { x: e2.clientX, y: e2.clientY };
        canvas.setPointerCapture(e2.pointerId);
        e2.preventDefault();
      }
    });
    canvas.addEventListener("pointermove", (e2) => {
      if (!isPanning) return;
      const dx = e2.clientX - lastPan.x;
      const dy = e2.clientY - lastPan.y;
      camera.x += dx;
      camera.y += dy;
      lastPan = { x: e2.clientX, y: e2.clientY };
    });
    canvas.addEventListener("pointerup", (e2) => {
      if (isPanning) {
        isPanning = false;
        canvas.releasePointerCapture(e2.pointerId);
      }
    });
    canvas.addEventListener("wheel", (e2) => {
      e2.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = e2.clientX - rect.left;
      const sy = e2.clientY - rect.top;
      const world = screenToWorld(sx, sy);
      const zoomFactor = Math.exp(-e2.deltaY * 1e-3);
      const newScale = clamp(camera.scale * zoomFactor, 0.4, 6);
      camera.x = sx - world.x * newScale;
      camera.y = sy - world.y * newScale;
      camera.scale = newScale;
    }, { passive: false });
    window.addEventListener("keydown", (e2) => {
      if (e2.code === "Space") {
        params.paused = !params.paused;
        e2.preventDefault();
      }
    });
    window.addEventListener("resize", resize);
    resize();
    resetElectron();
    state.lastTime = performance.now();
    requestAnimationFrame(loop);
  })();
})();
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */
