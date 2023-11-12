/* eslint-disable no-mixed-spaces-and-tabs */
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { TableauQueryViewModel } from '@fubonlife/oss-api-axios-sdk';

declare module 'vue/types/vue' {
	interface Vue {
		$tableau: TableauService;
	}
}
export interface TableauOption {
	router: VueRouter;
}

export class TableauService implements PluginObject<TableauOption> {
	private opt: TableauOption;

	/**
	 * @summary 取得tableau
	 */
	 async gotoTableauUrl(chartID) {
		const data: TableauQueryViewModel = {
			viewId: chartID,
		};
		await	Vue.prototype.$TableauApi.getTicketAndReturnFullViewUrlUsingPOST(data)
			.then((resp) => {
				if (resp.status === 200) {
					window.open(resp.data.data, '_target');
				}
			});
	}

	public install(Vue, options: TableauOption) {
		Vue.prototype.$tableau = this;
		this.opt = options;
	}
}
export default new TableauService();
