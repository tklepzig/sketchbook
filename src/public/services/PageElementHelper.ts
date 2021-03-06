import { Line, PageElement, Text } from "@shared/models";

class PageElementHelper {
    public elementIsLine(element: PageElement): element is Line {
        return element.kind === "line";
    }

    public elementIsText(element: PageElement): element is Text {
        return element.kind === "text";
    }
}

export default new PageElementHelper();
