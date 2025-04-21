import { z } from "zod";

export const getAllOredrQueryDto =  z
.object({
    page:z.preprocess((val) => +val, z.number().min(1).max(50)).optional(),
    limit:z.preprocess((val) => +val, z.number().min(1).max(100)).optional(),
    sort:z.record(z.enum(["1", "-1"])).optional(),
    total:z.record(z.enum(["gt", "gte", "lt", "lte"]),z.string()).optional(),
    
})
.strict();