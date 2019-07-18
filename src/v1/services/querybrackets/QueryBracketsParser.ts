import { Service } from '@tsed/di';
import BadQueryBracketFormatException from '../../exception/queryBrackets/BadQueryBracketFormatException';
import literals from '../../constants/literals/literals';

@Service()
export default class QueryBracketsParser {

    public parseQueryBracketsParam(queryBracketsParams: string, paramsRegExp?: string) {
        if (!queryBracketsParams) {
            return null;
        }

        const regExp: RegExp = new RegExp(paramsRegExp);

        if (!regExp.test(queryBracketsParams)) {
            throw new BadQueryBracketFormatException(`${literals.BRACKET_QUERY_WRONG_FORMAT}. RegExp: ${paramsRegExp}`);
        }

        const querySplited: string[] = queryBracketsParams.split('][');
        const queryCleanString: string[] = querySplited.map(filter => this.deleteBrackets(filter));
        const params: any[] = queryCleanString.map(param => this.parseCleanParams(param));

        return params;
    }

    private deleteBrackets(filter: string): string {
        if (filter.charAt(0) === '[') {
            filter = filter.substr(1);
        }

        if (filter.charAt(filter.length - 1) === ']') {
            filter = filter.substring(0, filter.length - 1);
        }

        return filter;
    }

    private parseCleanParams(cleanParam: string): any[] {

        const param: any[] = [];
        while (cleanParam.indexOf(':') !== -1) {
            const item: string = cleanParam.substr(0, cleanParam.indexOf(':'));
            cleanParam = cleanParam.substring(cleanParam.indexOf(':') + 1);
            param.push(item);
        }

        param.push(cleanParam);

        return param;
    }
}