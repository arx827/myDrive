import { FblFilter, FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import validationUtil from "@/assets/config/ValidationUtil";

export class FiltersUtil {

    /**
     * @description 統一建立 Filter 物件
     * @param key 
     * @param operator 
     * @param value 
     * @returns 
     * 
     * @version 2021/05/25
     * @author B1529
     */
    static setFilterParam(key : string, operator: FblOperator, value: string | number | Date | boolean) : FblFilter  {

        if(!validationUtil.isEmpty(value)) {
            return {
                property: key,
                operator: operator,
                operand: [value]
            };
        }
    }

    /**
     * @description 統一建立 Filter 物件
     * @param filterParam 
     * @returns 
     */
    static setFilters(...filterParam:FblFilter[]) : FblFilters{
        
        let filter = {
            filters : []
        }

        if(!validationUtil.isEmpty(filterParam)){
            filterParam.forEach( f => {
                if(!validationUtil.isEmpty(f)){
                    filter.filters.push(f);
                }
            });
        }
        
        return filter;
    }
}