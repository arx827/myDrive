import Fuse from 'fuse.js';

export default class fuzzySearch {
	// fuzzySearchFn(查詢關鍵字,被查詢JSON欄位,JSON)
	static fuzzySearchJSON(keyword: string, keys: string[], data) {
  	if (keyword !== '') {
  		const matchLength = keyword.length;
  		const options = {
  			keys,
  			threshold: 0,
  			minMatchCharLength: matchLength,
  			ignoreLocation: true,
  		};
  		const fuse = new Fuse(data, options);
  		const result = fuse.search(keyword);
  		return result.map((val) => val.item);
  	}
  	return data;
	}
}
