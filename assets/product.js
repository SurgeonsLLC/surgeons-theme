/**
 * product.js — Product page components
 * CBD Surgeons & Surgeons, LLC / surgeonsolution.io
 *
 * Dependencies: global.js must load first (provides DropdownComponent, DeferredMedia,
 * fetchConfig, trapFocus, togglerLoader, debounce, getJsonParse, sectionArrRender,
 * fetchAtc, onVariantChange, setStatuses, toggleAvail, renderVariant, setGallery, setAttr)
 *
 * Loaded on: product pages, collection/search pages (for quick-view)
 */

class VariantDropdown extends DropdownComponent {
constructor() {
  super();

  this.items = this.content.querySelectorAll('[data-btn-variant]');
  if(!this.items) return;
}

open(){
  this.variantSelect = this.onVariantSelect.bind(this);
  this.items.forEach(item => {item.addEventListener('click', this.variantSelect);});
  super.open();
}

close(){
  this.items.forEach(item => {item.removeEventListener('click', this.variantSelect);});
  super.close();
}

onVariantSelect(event){
  const target = event.target;
  this.items.forEach(item => item.classList.remove('active'));
  target.classList.add('active');
  this.setCurrentValue(target);
}

setCurrentValue(target){
  const elem = this.button.querySelector('[data-current-value]');
  elem.textContent = target.dataset.text;
  this.setVariantOptions(target.dataset.value);
  this.close();
}

setVariantOptions(value){
  const parent = document.querySelector(this.dataset.parent);
  const errElem = document.querySelector(this.dataset.errorSelector);
  if(!parent) return;
  if(errElem) errElem.classList.add('hidden');
  const currentSet = JSON.parse(this.dataset.currentSet);
  const index = parseInt(this.dataset.optionIndex);
  currentSet[index] = value;
  const selects = parent.querySelectorAll('variant-dropdown');
  selects.forEach(select => select.setAttribute('data-current-set', JSON.stringify(currentSet)));
  this.setOptions(selects, currentSet);
  onVariantChange(this.dataset.jsonSelector, currentSet, this.dataset.forms, this.dataset.renders, this.dataset.mainParent, this.dataset.galleries, this.dataset.sectionId, this.dataset.productUrl, this.dataset.updateUrl, this.dataset.focusSelector ? this.dataset.focusSelector : null);
}

setOptions(elems, set){
  const json = document.querySelector(this.dataset.jsonSelector);
  const data = JSON.parse(json.textContent);
  const variants = data.variants;
  const selectedOptionOneVariants = variants.filter(variant => set[0] === variant.option1);
  elems.forEach((select, index) => {
    if (index === 0) return;
    const optionInputs = [...select.querySelectorAll('[data-btn-variant]')];
    const previousOptionSelected = elems[index - 1].querySelector('[data-btn-variant].active').dataset.value;
    const availableOptionInputsValue = selectedOptionOneVariants.filter(variant => variant.available && variant[`option${ index }`] === previousOptionSelected).map(variantOption => variantOption[`option${ index + 1 }`]);
    this.setAvailability(optionInputs, availableOptionInputsValue);
  });
}

setAvailability(listOfOptions, listOfAvailableOptions) {
  listOfOptions.forEach(elem => {
    const labelText = elem.querySelector('[data-variant-status-text]');
    if (listOfAvailableOptions.includes(elem.getAttribute('data-value'))){
      labelText.classList.add('hidden');
      return;
    }
    labelText.classList.remove('hidden');
  });
}
}
if(!customElements.get('variant-dropdown')) customElements.define('variant-dropdown', VariantDropdown);

class VariantPill extends HTMLElement {
constructor() {
  super();

  this.variantChange = this.onInputChange.bind(this);
  this.addEventListener('change', this.variantChange);
}

onInputChange(){
  const input = this.querySelector('input[type="radio"]:checked');
  this.setVariantOptions(input.value);
}

setVariantOptions(value){
  const parent = document.querySelector(this.dataset.parent);
  const mainParent = document.querySelector(this.dataset.mainParent);
  const errElem = document.querySelector(this.dataset.errorSelector);
  if(!parent) return;
  if(mainParent && mainParent.hasAttribute('data-bundle-included')){
    const bundleCalculator = document.querySelector('bundle-calculator');
    mainParent.removeAttribute('data-bundle-included');
    bundleCalculator.init(null, null, null, null, parseFloat(mainParent.dataset.bundleVariant));
  }
  if(errElem) errElem.classList.add('hidden');
  const currentSet = JSON.parse(this.dataset.currentSet);
  const index = parseInt(this.dataset.optionIndex);
  currentSet[index] = value;
  const pills = parent.querySelectorAll('variant-pill');
  pills.forEach(pill => pill.setAttribute('data-current-set', JSON.stringify(currentSet)));
  this.setOptions(pills, currentSet);
  let availableSet = null;
  if(this.dataset.checkSets === 'true'){
    const sets = JSON.parse(this.dataset.availableSets);
    const checkSet = (val) => {
      if (!val || !Array.isArray(sets)) return null;
      return sets.find(set => set.includes(val));
    };
    availableSet = checkSet(value);
  }
  onVariantChange(this.dataset.jsonSelector, availableSet ? availableSet : currentSet, this.dataset.forms, this.dataset.renders, this.dataset.mainParent, this.dataset.galleries, this.dataset.sectionId, this.dataset.productUrl, this.dataset.updateUrl, this.dataset.focusSelector ? this.dataset.focusSelector : null, this.dataset.mediaTemplate === 'true' ? true : false, this.dataset.mediaTemplate === 'true' ? this.dataset.template : null, this.dataset.bundle === 'true' ? true : false);
}

setOptions(elems, set){
  const json = document.querySelector(this.dataset.jsonSelector);
  const data = JSON.parse(json.textContent);
  const variants = data.variants;
  const selectedOptionOneVariants = variants.filter(variant => set[0] === variant.option1);
  elems.forEach((option, index) => {
    if (index === 0) return;
    const optionInputs = [...option.querySelectorAll('input[type="radio"]')];
    const previousOptionSelected = elems[index - 1].querySelector(':checked').value;
    const availableOptionInputsValue = selectedOptionOneVariants.filter(variant => variant.available && variant[`option${ index }`] === previousOptionSelected).map(variantOption => variantOption[`option${ index + 1 }`]);
    this.setAvailability(optionInputs, availableOptionInputsValue);
  });
}

setAvailability(listOfOptions, listOfAvailableOptions) {
  listOfOptions.forEach(elem => {
    const label = elem.nextElementSibling;
    const labelText = label.querySelector('[data-variant-status-text]');
    if (listOfAvailableOptions.includes(elem.getAttribute('value'))){
      elem.classList.remove('disabled');
      labelText.classList.add('hidden'), labelText.classList.remove('visually-hidden');
      return;
    }
    elem.classList.add('disabled');
    labelText.classList.remove('hidden'), labelText.classList.add('visually-hidden');
  });
}
}
if(!customElements.get('variant-pill')) customElements.define('variant-pill', VariantPill);

class ProductModel extends DeferredMedia {
constructor() {
  super();
}

_lc() {
  super._lc();
  Shopify.loadFeatures([
    {
      name: 'model-viewer-ui',
      version: '1.0',
      onLoad: this._smv.bind(this),
    }
  ]);
}

_smv(errors) {
  if (errors) return;
  this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));
}
}
if(!customElements.get('product-model')) customElements.define('product-model', ProductModel);
window.ProductModel = {
loadShopifyXR() {
  Shopify.loadFeatures([
    {
      name: 'shopify-xr',
      version: '1.0',
      onLoad: this._sxr.bind(this),
    }
  ]);
},
_sxr(errors) {
  if (errors) return;
  if (!window.ShopifyXR) {
    document.addEventListener('shopify_xr_initialized', () =>
      this._sxr()
    );
    return;
  }
  document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
    window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
    modelJSON.remove();
  });
  window.ShopifyXR.setupXRElements();
}
};
window.addEventListener('DOMContentLoaded', () => window.ProductModel?.loadShopifyXR && window.ProductModel.loadShopifyXR());

class ShareComponent extends DropdownComponent {
constructor() {
  super();

  this.urlInput = this.querySelector('.shareUrl');
  if(navigator.share){
    this.button.removeEventListener('click', this.onButtonClick);
    this.button.addEventListener('click', () => { navigator.share({ url: this.urlInput.value, title: document.title }); });
    this.classList.add('--share-native');
    return;
  }
  this.classList.remove('--share-native');
  this.successMessage = this.querySelector('.shareMessage');
  this.shareButton = this.querySelector('.share-button__copy');
  this.label = this.querySelector('.share-button__label');
  this.shareButton.addEventListener('click', this.copyToClipboard.bind(this));
}

toggleDetails(){
  this.successMessage.classList.add('hidden');
  this.successMessage.textContent = '';
  this.closeButton.classList.add('hidden');
  this.label.classList.remove('hidden');
}

copyToClipboard(){
  navigator.clipboard.writeText(this.urlInput.value).then(() => {
    this.successMessage.classList.remove('hidden');
    this.successMessage.textContent = window.accessibilityStrings.shareSuccess;
    this.closeButton.classList.remove('hidden');
    this.label.classList.add('hidden');
  });
}

close(){
  super.close();
  this.toggleDetails();
}
}
if(!customElements.get('share-component')) customElements.define('share-component', ShareComponent);

class RecipientForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(){
    this.checkboxInput = this.querySelector(`[id*="Recipient-Checkbox"]`);
    this.checkboxInput.disabled = false;
    this.hiddenControlField = this.querySelector(`[id*="Recipient-Control"]`);
    this.hiddenControlField.disabled = true;
    this.emailInput = this.querySelector(`[id*="Recipient-email"]`);
    this.nameInput = this.querySelector(`[id*="Recipient-name"]`);
    this.messageInput = this.querySelector(`[id*="Recipient-message"]`);
    this.sendonInput = this.querySelector(`[id*="Recipient-send-on"]`);
    this.errorMessageWrapper = this.querySelector('.product-form__recipient-error-message-wrapper');
    this.errorMessageList = this.errorMessageWrapper.querySelector('ul');
    this.errorMessage = this.errorMessageWrapper.querySelector('.error-message');
    this.defaultErrorHeader = this.errorMessage?.innerText;
    this.currentProductVariantId = this.dataset.productVariantId;
    this.addEventListener('change', this.onChange.bind(this));
  }

  onChange() {
    if (!this.checkboxInput.checked) {
      this.clearInputFields();
      this.clearErrorMessage();
    }
  }

  clearInputFields(flag = false) {
    if (this.emailInput) this.emailInput.value = '';
    if (this.nameInput) this.nameInput.value = '';
    if (this.messageInput) this.messageInput.value = '';
    if (this.sendonInput) this.sendonInput.value = '';
    if (flag) this.checkboxInput.checked = false;
  }

  displayErrorMessage(title, body) {
    this.clearErrorMessage();
    this.errorMessageWrapper.hidden = false;
    if (typeof body === 'object') {
      this.errorMessage.innerText = this.defaultErrorHeader;
      return Object.entries(body).forEach(([key, value]) => {
        const errorMessageId = `RecipientForm-${ key }-error-${ this.dataset.sectionId }-${this.dataset.productId}`;
        const fieldSelector = `#Recipient-${ key }-${ this.dataset.sectionId }-${this.dataset.productId}`;
        const label = key.includes('send_on') ? '' : key;
        const message = `${label} ${value}`;
        const errorMessageElement = this.querySelector(`#${errorMessageId}`);
        const errorTextElement = errorMessageElement?.querySelector('.error-message');
        if (!errorTextElement) return;
        if (this.errorMessageList) this.errorMessageList.appendChild(this.createErrorListItem(fieldSelector, message));
        errorTextElement.innerText = `${message}.`;
        errorMessageElement.classList.remove('hidden');
        const inputElement = this[`${key}Input`];
        if (!inputElement) return;
        inputElement.setAttribute('aria-invalid', true);
        inputElement.setAttribute('aria-describedby', errorMessageId);
      });
    }
    this.errorMessage.innerText = body;
  }

  createErrorListItem(target, message) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', target);
    a.innerText = message;
    a.classList.add('errors-list_link');
    li.appendChild(a);
    li.className = "error-message errors-list_item";
    return li;
  }

  clearErrorMessage() {
    this.errorMessageWrapper.hidden = true;
    if (this.errorMessageList) this.errorMessageList.innerHTML = '';
    this.querySelectorAll('.recipient-fields .form__message').forEach(field => {
      field.classList.add('hidden');
      const textField = field.querySelector('.error-message');
      if (textField) textField.innerText = '';
    });
    [this.emailInput, this.messageInput, this.nameInput].forEach(inputElement => {
      inputElement.setAttribute('aria-invalid', false);
      inputElement.removeAttribute('aria-describedby');
    });
  }

  resetRecipientForm() {
    if (this.checkboxInput.checked) {
      this.checkboxInput.checked = false;
      this.clearInputFields();
      this.clearErrorMessage();
    }
  }
}
if(!customElements.get('recipient-form')) customElements.define('recipient-form', RecipientForm);

class AtcBundleToggler extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(){
    this.form = document.querySelector(this.dataset.form);
    if(!this.form) return;
    const onBundleSubmit = (event) => {
      event.preventDefault();
      const parent = document.querySelector(this.dataset.mainParent);
      const btnSpan = parent.querySelector('[data-atc-text]');
      const formData = new FormData(this.form);
      const mediaElement = document.querySelector(this.dataset.gallery);
      const bundleCalculator = document.querySelector('bundle-calculator');
      bundleCalculator.init(mediaElement, parseInt(formData.get('id')), formData.get('variant_price'), formData.get('variant_compare_price'));
      if(!parent.hasAttribute('data-bundle-included')){
        btnSpan.innerText = btnSpan.dataset.removeText;
        parent.setAttribute('data-bundle-included', '');
        parent.setAttribute('data-bundle-variant', parseInt(formData.get('id')));
      } else{
        btnSpan.innerText = btnSpan.dataset.textAvail;
        parent.removeAttribute('data-bundle-included');
        parent.removeAttribute('data-bundle-variant');
      }
    };
    this.form.addEventListener('submit', onBundleSubmit);
  }

  onRemoval(){
    const parent = document.querySelector(this.dataset.mainParent);
    const btnSpan = parent.querySelector('[data-atc-text]');
    btnSpan.innerText = btnSpan.dataset.textAvail;
    parent.removeAttribute('data-bundle-included');
    parent.removeAttribute('data-bundle-variant');
  }
}
if(!customElements.get('atc-bundle-toggler')) customElements.define('atc-bundle-toggler', AtcBundleToggler);

class BundleCalculator extends HTMLElement {
  constructor() {
    super();

    this.arr = [];
    this.list = this.querySelector('[data-thumbnails-list]');
    this.btn = this.querySelector('[data-bundle-atc-btn]');
    if(this.btn) this.btn.addEventListener('click', this.onBundleSubmit.bind(this));
  }

  init(media, variant, price, comparePrice, removeId = null){
    const createDataset = (id, price, comparePrice, media) => {
      const index = this.arr.findIndex(item => item.variant === id);
      if(index === -1) return this.arr.push({ variant: id, media: media, price: parseInt(price), comparePrice: parseInt(comparePrice) });
      this.arr.splice(index, 1);
    }
    const updateStats = (price, comparePrice, count) => {
      const bundleNumElement = this.querySelector('[data-num-count]');
      const bundlePriceElement = this.querySelector('[data-bundle-price]');
      const bundleComparePriceElement = this.querySelector('[data-bundle-compare-price]');
      const bundleAtcBtn = this.querySelector('[data-bundle-atc-btn]');
      bundlePriceElement.innerText = Shopify.formatMoney(price, window.money_format);
      if(comparePrice === price){
        bundleComparePriceElement.classList.add('hidden');
      } else{
        bundleComparePriceElement.innerText = Shopify.formatMoney(comparePrice, window.money_format);
        bundleComparePriceElement.classList.remove('hidden');
      }
      if(count === 0){
        bundleNumElement.classList.add('hidden');
        bundleAtcBtn.classList.add('disabled');
        return;
      }
      bundleNumElement.innerText = count;
      bundleNumElement.classList.remove('hidden');
      bundleAtcBtn.classList.remove('disabled');
    }
    const renderDataList = () => {
      let bundlePrice = 0;
      let bundleComparePrice = 0;
      this.resetThumbsList();
      this.arr.forEach(product => {
        const thumbItem = document.createElement("li");
        this.list.appendChild(thumbItem);
        if(product.media) thumbItem.style.backgroundImage = `url('${product.media.src}')`;
        this.list.appendChild(thumbItem);
        bundlePrice += product.price;
        bundleComparePrice += product.comparePrice !== 0 ? product.comparePrice : product.price;
      });
      updateStats(bundlePrice, bundleComparePrice, this.arr.length);
    }
    if(removeId){
      const index = this.arr.findIndex(item => item.variant === removeId);
      this.arr.splice(index, 1);
      renderDataList();
      return;
    }
    createDataset(variant, price, comparePrice, media);
    renderDataList();
  }

  resetThumbsList(){
    while(this.list.firstChild){
      this.list.removeChild(this.list.firstChild);
    }
  }

  onBundleSubmit(event){
    event.preventDefault();
    const runAtc = () => {
      togglerLoader(true, this.dataset.loaderSelector);
      if(this.arr.length > 0){
        const product = this.arr[0];
        fetchBundleAtc(product);
        return;
      }
      togglerLoader(false, this.dataset.loaderSelector);
      if(this.dataset.redirect) return window.location.href = this.dataset.redirect;
      if(this.dataset.modal === 'true'){
        const drawerToggler = document.querySelector(this.dataset.modalRef);
        if(drawerToggler) drawerToggler.dispatchEvent(new Event('click'));
      }
    }
    const fetchBundleAtc = (product) => {
      const secArr = JSON.parse(this.dataset.sections);
      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      const formData = new FormData();
      formData.append('sections', secArr.map(section => section.id));
      formData.append('sections_url', window.location.pathname);
      formData.append('id', product.variant);
      formData.append('quantity', 1);
      config.body = formData;
      fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        sectionArrRender(secArr, response);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        const parentCard = document.querySelector(`[data-bundle-included][data-bundle-variant="${product.variant}"]`);
        const toggler = parentCard.querySelector('atc-bundle-toggler');
        toggler.onRemoval();
        this.init(null, null, null, null, product.variant);
        runAtc();
      });
    }
    runAtc();
  }
}
if(!customElements.get('bundle-calculator')) customElements.define('bundle-calculator', BundleCalculator);

if (!customElements.get('hotspot-switcher')) {
  customElements.define('hotspot-switcher', class HotspotSwitcher extends HTMLElement {
    constructor() {
      super();

      this.button = this.querySelector('button');
    }

    connectedCallback(){
      if(!this.button) return;
      this.initialize();
    }

    initialize(){
      this.clickRef = this.onClickRef.bind(this);
      this.button.addEventListener('click', this.clickRef);
    }

    onClickRef(event){
      event.preventDefault();
      const scrollParent = document.querySelector(`${this.dataset.refParent} [data-scroll-parent]`);
      const parentTop = scrollParent.getBoundingClientRect().top;
      const refProduct = document.querySelector(`${this.dataset.refProduct}`);
      const productTop = refProduct.getBoundingClientRect().top;
      scrollParent.scrollTo({
        top: scrollParent.scrollTop + (productTop - parentTop),
        behavior: "smooth"
      });
      this.removeActives();
      setAttr(this.button, true, 'data-selected');
    }

    removeActives(){
      const components = document.querySelectorAll(`${this.dataset.refParent} hotspot-switcher`);
      components.forEach(component => {
        const button = component.querySelector('button');
        setAttr(button, false, 'data-selected');
      });
    }
  });
}
