/**
 * collection.js — Collection/search page components
 * CBD Surgeons & Surgeons, LLC / surgeonsolution.io
 *
 * Dependencies: global.js must load first (provides DropdownComponent, ModalRenderComponent,
 * fetchConfig, trapFocus, togglerLoader, debounce, sectionArrRender)
 *
 * Loaded on: collection pages, search pages, list-collections
 */

const setFilterParam = (param, value, remove = false, getParams = false) => {
  const input = document.getElementById('filters-params');
  const url = new URL(input.value, window.location.origin);
  if(getParams){
    const params = new URLSearchParams(url.searchParams).toString();
    return params;
  }
  switch(remove){
    case true:
      if(param.includes('price')){
        [...url.searchParams.keys()].forEach(key => key.includes('filter.v.price') && url.searchParams.delete(key));
      } else{
        const valToDel = value;
        const values = url.searchParams.getAll(param);
        const updatedValues = values.filter(value => value !== valToDel);
        url.searchParams.delete(param);
        updatedValues.forEach(value => url.searchParams.append(param, value));
      }
      break;
    case 'all':
      [...url.searchParams.keys()].forEach(key => key.includes('filter') && url.searchParams.delete(key));
      break;
    default:
      if(param.includes('price')){
        url.searchParams.set(param, value);
      } else{
        url.searchParams.append(param, value);
      }
      break;
  }
  input.value = url.toString();
}

class ModalFilterComponent extends ModalRenderComponent {
  constructor() {
    super();
  }

  renderModal(){
    togglerLoader(true);
    const sectionId = document.getElementById('modal-section').value;
    const modalParams = document.querySelector('#filters-params');
    fetch(modalParams.value + sectionId)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html').querySelector(`#${this.dataset.renderSelector}`);
        const parent = this.querySelector(this.dataset.selector);
        parent.innerHTML = html.innerHTML;
      })
      .catch((e) => {
        console.error(e);
        throw e;
      })
      .finally(() => {
        setTimeout(() => {
          this.initFilters();
          togglerLoader(false);
        }, 1000);
      }
    );
  }

  initFilters(){
    trapFocus(this.content);
    this.setListeners(true);
    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);
    setTimeout(() => {
      this.classList.add('--rendered');
    }, 500);
    this.fields = this.querySelectorAll('input');
    this.fields.forEach(field => {
      field.addEventListener('input', this.debouncedOnSubmit.bind(this));
    });
  }

  onSubmitHandler(event){
    event.preventDefault();
    const target = event.target;
    switch(target.type){
      case 'checkbox':
        setFilterParam(target.name, target.value, !target.checked);
        break;
      case 'range':
        setFilterParam(target.name, target.value);
        break;
      default:
        console.log('other any');
        break;
    }
    const facetsFilter = document.querySelector('facets-filter');
    facetsFilter.onSubmitHandler(target.id);
  }

  close() {
    this.fields.forEach(field => {
      field.removeEventListener('input', this.onSubmitHandler.bind(this));
    });
    setTimeout(() => {
      this.classList.add('--rendered');
    }, 500);
    super.close();
  }
}
if(!customElements.get('modal-filter-component')) customElements.define('modal-filter-component', ModalFilterComponent);

class FacetsFilter extends HTMLElement {
  constructor() {
    super();

    this.cachedResults = [];
    window.addEventListener('popstate', this.onHistoryChange.bind(this));
  }

  connectedCallback(){
    this.initParams = setFilterParam(null, null, false, true);
  }

  onHistoryChange(event){
    if(event.state && this.cachedResults.length === 0){
      const searchParams = event.state ? event.state.searchParams : this.initParams;
      const sectionsInput = document.querySelector('#filters-sections');
      const baserUrl = document.querySelector('#base-url');
      const url = baserUrl.value + '?' + searchParams + sectionsInput.value;
      this.renderFetch(url, false, searchParams);
      return;
    }

    if(this.cachedResults && this.cachedResults.length > 0){
      const searchParams = event.state ? event.state.searchParams : this.initParams;
      const term = {params: searchParams};
      if (this.cachedResults.some(key => key.params === term.params)) return this.renderFromCache(this.cachedResults, term, false);
      const sectionsInput = document.querySelector('#filters-sections');
      const baserUrl = document.querySelector('#base-url');
      const url = baserUrl.value + '?' + searchParams + sectionsInput.value;
      this.renderFetch(url, false, searchParams);
    }
  }

  onSubmitHandler(target){
    togglerLoader(true);
    const input = document.querySelector('#filters-params');
    let inputValue = input.value;
    if(!inputValue.includes('?')) inputValue = input.value + '?';
    const sectionsInput = document.querySelector('#filters-sections');
    const url = inputValue + sectionsInput.value;
    const searchParams = setFilterParam(null, null, false, true);
    const term = {params: searchParams};
    if(this.cachedResults.length > 0 && this.cachedResults.some(key => key.params === term.params)){
      this.renderFromCache(this.cachedResults, term, true, target);
      return;
    }
    this.renderFetch(url, true, searchParams, target);
  }

  renderFetch(url, updateURLHash = false, searchParams, target = null){
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const secArr = JSON.parse(this.dataset.sections);
        secArr.forEach(section => {
          const html = new DOMParser() .parseFromString(data[section.id], 'text/html').getElementById(section.id);
          section.selectors.forEach(selector => {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.outerHTML = sourceElement.outerHTML;
            }
          });
        });
        const cacheObj = {params: searchParams, content: data};
        this.cachedResults.push(cacheObj);
      })
      .catch((e) => {
        console.log(e);
        throw e;
      })
      .finally(() => {
        if(updateURLHash) this.updateURLHash(searchParams);
        const modal = document.querySelector('modal-filter-component.modal--active');
        if(modal) modal.initFilters();
        if(target){
          const org = document.getElementById(target);
          if(org) org.focus();
        }
        togglerLoader(false);
      }
    );
  }

  renderFromCache(cache, filter, updateURLHash = false, target = null){
    const cacheDataArr = cache;
    const cachedResults = cacheDataArr.find(results => results.params === filter.params);
    const secArr = JSON.parse(this.dataset.sections);
    secArr.forEach(section => {
      const html = new DOMParser() .parseFromString(cachedResults.content[section.id], 'text/html').getElementById(section.id);
      section.selectors.forEach(selector => {
        const targetElement = document.querySelector(selector);
        const sourceElement = html.querySelector(selector);
        if (targetElement && sourceElement) {
          targetElement.outerHTML = sourceElement.outerHTML;
        }
      });
    });
    if(updateURLHash) this.updateURLHash(filter.params);
    const modal = document.querySelector('modal-filter-component.modal--active');
    if(modal) modal.initFilters();
    if(target){
      const org = document.getElementById(target);
      if(org) org.focus();
    }
    togglerLoader(false);
  }

  updateURLHash(searchParams){
    const updatedSearchParams = setFilterParam(null, null, false, true);
    history.pushState({ searchParams }, '', `${window.location.pathname}${updatedSearchParams && '?'.concat(updatedSearchParams)}`);
  }
}
if(!customElements.get('facets-filter')) customElements.define('facets-filter', FacetsFilter);

class PriceRange extends HTMLElement {
constructor() {
  super();
}

connectedCallback(){
  this.inputs = this.querySelectorAll('input[type="range"]');
  if(!this.inputs) return;

  const onSlideWatch = () => {
    const minInput = this.querySelector('.min');
    const maxInput = this.querySelector('.max');
    const minText = this.querySelector('[data-text-min]');
    const maxText = this.querySelector('[data-text-max]');
    var minVal = minInput.value;
    var maxVal = maxInput.value;
    if(minInput && minVal > maxVal-0) minInput.value = maxVal - 0;
    setPriceText(minText, minInput.value);
    if(maxInput && maxVal-0 < minVal) maxInput.value = 0 + minVal;
    setPriceText(maxText, maxInput.value);
  }

  const setPriceText = (element, value) => {
    const price = parseFloat(value) * 100;
    element.innerText = Shopify.formatMoney(price, window.money_format);
  }
  this.watch = onSlideWatch.bind(this);
  this.inputs.forEach(input => {
    input.addEventListener('input', this.watch);
  });
}
}
customElements.define('price-range', PriceRange);

class SortDropdown extends DropdownComponent {
constructor() {
  super();

  this.items = this.content.querySelectorAll('[data-btn-sort]');
  if(!this.items) return;
}

connectedCallback(){
  const setCurrentValue = (target) => {
    const elem = this.button.querySelector('[data-current-value]');
    elem.textContent = target.dataset.text;
    setFilterParam('sort_by', target.dataset.value);
    const facetsFilter = document.querySelector('facets-filter');
    facetsFilter.onSubmitHandler();
    this.close();
  }

  const onSortSelect = (event) => {
    const target = event.target;
    this.items.forEach(item => item.classList.remove('active'));
    target.classList.add('active');
    setCurrentValue(target);
  }
  this.sortSelect = onSortSelect.bind(this);
}

open(){
  this.items.forEach(item => {item.addEventListener('click', this.sortSelect);});
  super.open();
}

close(){
  this.items.forEach(item => {item.removeEventListener('click', this.sortSelect);});
  super.close();
}
}
if(!customElements.get('sort-dropdown')) customElements.define('sort-dropdown', SortDropdown);

class FacetRemoveButton extends HTMLElement {
constructor() {
  super();
}

connectedCallback(){
  this.button = this.querySelector('button');
  if(!this.button) return;

  const onClick = (event) => {
    event.preventDefault();
    switch (this.dataset.name) {
      case 'all':
        setFilterParam(null, null, 'all')
        break;
      default:
        setFilterParam(this.dataset.name, this.dataset.value, true);
        break;
    }
    const facetsFilter = document.querySelector('facets-filter');
    facetsFilter.onSubmitHandler();
  }
  this.button.addEventListener('click', onClick.bind(this));
}
}
if(!customElements.get('facet-remove-button')) customElements.define('facet-remove-button', FacetRemoveButton);

if (!customElements.get('product-recommendations')) {
customElements.define('product-recommendations', class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.empty = true;
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);
      fetch(this.dataset.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('.product-recommendations');
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.empty = false;
            this.innerHTML = recommendations.innerHTML;
            if(!recommendations.innerHTML.includes('data-recommend-check')){
              let recommendationAncestor = this.parentElement;
              while (recommendationAncestor && !recommendationAncestor.classList.contains('recommendation')) {
                recommendationAncestor = recommendationAncestor.parentElement;
              }
              if(recommendationAncestor) recommendationAncestor.classList.add('hidden');
            }
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          if(this.empty) this.parentElement.classList.add('hidden');
        }
      );
    }
    new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 400px 0px'}).observe(this);
  }
});
}

class PredictiveComponent extends HTMLElement {
  constructor() {
    super();

    this.searchTerm = '';
    this.cachedResults = [];
    this.abortController = new AbortController();
  }

  connectedCallback(){
    this.form = this.querySelector('form');
    this.input = this.querySelector('input[name="q"]');
    if(!this.input) return;
    this.container = this.querySelector('[data-render-predict-results]');
    this.debouncedOnSubmit = debounce((event) => {
      this.onFetchQuery(event);
    }, 500);
    this.input.addEventListener('input', this.debouncedOnSubmit.bind(this));
  }

  close(){
    if(!this.input) return;
    this.input.removeEventListener('input', this.debouncedOnSubmit.bind(this));
    this.toggleResults(false);
  }

  onFetchQuery(){
    const inputValueTerm = this.input.value.replace(/\s/g, "");
    if(inputValueTerm.length > 0){
      this.searchTerm = this.input.value.trim();
      const term = {searchTerm: this.searchTerm};
      if (!this.cachedResults || !this.cachedResults.some(key => key.searchTerm === term.searchTerm)) {
        this.fetchSearchResults(this.searchTerm);
        return;
      }
      this.showCachedResults(term, this.cachedResults);
      return;
    }
    this.toggleResults(false);
  }

  fetchSearchResults(terms){
    togglerLoader(true);
    fetch(
      `${routes.predictive_search_url}?q=${encodeURIComponent(
          terms
        )}&section_id=predictive-organizer&resources[type]=${this.dataset.query}`,
        { signal: this.abortController.signal }
      )
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          console.log(error);
          togglerLoader(false);
          throw error;
        }
        return response.text();
      })
      .then((text) => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const searchObj = {
          searchTerm: this.searchTerm,
          contentHtml: html
        }
        this.cachedResults.push(searchObj);
        this.container.innerHTML = html.querySelector('[data-render-predict-results]').innerHTML;
        this.toggleResults(true);
        togglerLoader(false);
      })
      .catch((error) => {
        if (error?.code === 20) {
          console.log(error);
          togglerLoader(false);
          throw error;
        }
      }
    )
  }

  showCachedResults(data, cache){
    const cacheDataArr = cache;
    const cachedResults = cacheDataArr.find(results => results.searchTerm === data.searchTerm);
    this.container.innerHTML = cachedResults.contentHtml.querySelector('[data-render-predict-results]').innerHTML;
    this.toggleResults(true);
  }

  toggleResults(flag){
    if(flag) return this.container.classList.remove('hidden');
    this.input.value = '';
    this.container.classList.add('hidden');
  }
}
if(!customElements.get('predictive-component')) customElements.define('predictive-component', PredictiveComponent);
