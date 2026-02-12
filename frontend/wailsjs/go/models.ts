export namespace database {
	
	export class Analytics {
	    completion_rate: number;
	    total_tasks: number;
	    total_notes: number;
	    total_ideas: number;
	    insight_count: number;
	    streak: number;
	
	    static createFrom(source: any = {}) {
	        return new Analytics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.completion_rate = source["completion_rate"];
	        this.total_tasks = source["total_tasks"];
	        this.total_notes = source["total_notes"];
	        this.total_ideas = source["total_ideas"];
	        this.insight_count = source["insight_count"];
	        this.streak = source["streak"];
	    }
	}
	export class Log {
	    id: number;
	    name: string;
	    description: string;
	    due_date: string;
	    created_at: string;
	    item_count: number;
	
	    static createFrom(source: any = {}) {
	        return new Log(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.due_date = source["due_date"];
	        this.created_at = source["created_at"];
	        this.item_count = source["item_count"];
	    }
	}
	export class Tag {
	    id: number;
	    name: string;
	    color: string;
	    tag_id?: number;
	
	    static createFrom(source: any = {}) {
	        return new Tag(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.color = source["color"];
	        this.tag_id = source["tag_id"];
	    }
	}
	export class LogItem {
	    id: number;
	    log_id: number;
	    title: string;
	    details: string;
	    status: string;
	    sights: string;
	    time: string;
	    types: string;
	    tags?: Tag[];
	
	    static createFrom(source: any = {}) {
	        return new LogItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.log_id = source["log_id"];
	        this.title = source["title"];
	        this.details = source["details"];
	        this.status = source["status"];
	        this.sights = source["sights"];
	        this.time = source["time"];
	        this.types = source["types"];
	        this.tags = this.convertValues(source["tags"], Tag);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

