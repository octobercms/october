/**
 * Represents Editor document URI. Document URIs are fully qualified document identifiers.
 * URI syntax: "namespace:document-type:document-unique-key".
 * URI example:"cms:cms-page:index.htm".
 *
 * The document unique key can be empty, which corresponds to root
 * Navigator nodes.
 */
export class DocumentUri {
    namespace;
    documentType;
    uniqueKey;

    constructor(namespace, documentType, uniqueKey) {
        this.namespace = namespace;
        this.documentType = documentType;
        this.uniqueKey = uniqueKey;
    }

    static parse(uriString, silent) {
        const re = /^([^:]+):([^:]+):?([^:]*)$/;
        const matchData = uriString.match(re);

        if (!matchData || !matchData.length) {
            if (silent) {
                return false;
            }

            throw new Error(
                `Editor document URL must have format "namespace:document-type:document-unique-key". Invalid URI string: ${uriString}`
            );
        }

        return new DocumentUri(matchData[1], matchData[2], matchData[3]);
    }

    get uri() {
        return this.namespaceAndDocType + ':' + this.uniqueKey;
    }

    get namespaceAndDocType() {
        return this.namespace + ':' + this.documentType;
    }
}
