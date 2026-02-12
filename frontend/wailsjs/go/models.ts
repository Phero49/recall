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
	export class LogItem {
	    id: number;
	    log_id: number;
	    title: string;
	    details: string;
	    status: string;
	    sights: string;
	    time: string;
	    types: string;
	
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
	    }
	}

}

