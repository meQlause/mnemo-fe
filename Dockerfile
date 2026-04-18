FROM oven/bun:latest-slim AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:latest-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN echo 'import { serve } from "bun";\n\
import { join } from "path";\n\
import { readFileSync, existsSync } from "fs";\n\
\n\
serve({\n\
  port: 8880,\n\
  fetch(req) {\n\
    const url = new URL(req.url);\n\
    let path = join("dist", url.pathname === "/" ? "index.html" : url.pathname);\n\
    if (!existsSync(path) || url.pathname.indexOf(".") === -1) path = join("dist", "index.html");\n\
    return new Response(readFileSync(path));\n\
  },\n\
});\n\
console.log("Serving on http://localhost:8880");' > server.ts

EXPOSE 8880

CMD ["bun", "run", "server.ts"]
