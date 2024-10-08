/* import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse"

import { Button } from "@/components/ui/button";

type Props = {
    onUpload: (results: any) => void
}

export const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader();

    //ToDO: Add a paywall

    return (
        <CSVReader>
            {({ getRootProps }: any) => (
                <div className="">
                <Button
                    size="sm"
                    className="w-full lg:w-auto"
                    {...getRootProps()}
                >
                    <Upload className="size-4 mr-2" />
                    Import
                </Button>
                </div>
            )}
        </CSVReader>
    )
} */