import type { Document } from "langchain/document"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SourcesProps {
  sources: Document[]
  i: number
}

const Soruces = ({ sources, i }: SourcesProps) => {
  return (
    <div>
      <div className="p-5" key={`sourceDocsAccordion-${i}`}>
        <Accordion type="single" collapsible className="flex-col">
          {sources.map((doc, index) => (
            <div key={`messageSourceDocs-${index}`}>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>
                  <h3>Source {index + 1}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <ReactMarkdown linkTarget="_blank">
                    {doc.pageContent}
                  </ReactMarkdown>
                  <p className="mt-2">
                    <b>Source:</b> {doc.metadata.source}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default Soruces
