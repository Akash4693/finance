import { useState } from "react"
import { format, parse, isValid } from "date-fns"
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImportTable } from "./import-table"
import { convertAmountToMiliunits } from "@/lib/utils"

const dateFormat = "yyyy-MM-dd HH:mm:ss"
const outputFormat = "yyyy-MM-dd"

const requiredOptions = [
    "amount",
    "date",
    "payee",
]

interface SelectedColumnsState {
    [key: string]: string | null
}

type Props = {
    data: string[][]
    onCancel: () => void
    onSubmit: (data: any) => void
}

export const ImportCard = ({
    data,
    onCancel,
    onSubmit,
}: Props) => {

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({})

    const headers = data[0]
    const body = data.slice(1)

    const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev }
            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null
                }
            }
            if (value === "skip") {
                value = null
            }
            newSelectedColumns[`column_${columnIndex}`] = value
            return newSelectedColumns
        })
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length

    const handleContinue = () => {
        const getColumnIndex = (column: string) => column.split("_")[1]

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`)
                return selectedColumns[`column_${columnIndex}`] || null
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`)
                    return selectedColumns[`column_${columnIndex}`] ? cell : null
                })

                return transformedRow.every((item) => item === null)
                    ? []
                    : transformedRow
            }).filter((row) => row.length > 0),
        }

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index]
                if (header !== null) {
                    acc[header] = cell
                }
                return acc
            }, {})
        })

        const formattedData = arrayOfData.map((item) => ({
            ...item,
            amount: convertAmountToMiliunits(parseFloat(item.amount)), // Converts amount to miliunits
            date: format(
                isValid(parse(item.date, dateFormat, new Date())) 
                ? parse(item.date, dateFormat, new Date()) 
                : new Date(), outputFormat
            ), // Check and use current date if invalid
        }))

        onSubmit(formattedData)
        console.log(formattedData)
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transaction
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            onClick={onCancel} 
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            disabled={progress < requiredOptions.length}
                            onClick={handleContinue}
                            className="w-full lg:w-auto"
                        >
                            Continue ({progress} / {requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable 
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    )
}




/* import { useState } from "react"
import { format, parse, isValid } from "date-fns"
import { z } from "zod"  // Import Zod
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
 } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImportTable } from "./import-table"
import { convertAmountToMiliunits } from "@/lib/utils"

// Correct date formats based on date-fns Unicode tokens
const dateFormat = "yyyy-MM-dd HH:mm:ss"  // Correct date input format
const outputFormat = "yyyy-MM-dd"      // Correct year, month, day output format

const requiredOptions = [
    "amount",
    "date",
    "payee",
]

interface SelectedColumnsState {
    [key: string]: string | null
}

type Props = {
    data: string[][]
    onCancel: () => void
    onSubmit: (data: any) => void
}

const dateSchema = z.string().refine((val) => {
    // Parse date and check if it's valid
    const parsedDate = parse(val, dateFormat, new Date());
    return isValid(parsedDate);
}, {
    message: "Invalid date format. Expected yyyy-MM-dd HH:mm:ss"
});

export const ImportCard = ({
    data,
    onCancel,
    onSubmit,
}: Props) => {

    const [selectedColumns, setSelectedColumns] = 
    useState<SelectedColumnsState>({})

    const headers = data[0]
    const body = data.slice(1)

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev }

            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null
                }
            }

            if (value === "skip") {
                value = null
            }

            newSelectedColumns[`column_${columnIndex}`] = value
            return newSelectedColumns
        })
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        }

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`)
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`)
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                })

                return transformedRow.every((item) => item === null)
                    ? []
                    : transformedRow;
            }).filter((row) => row.length > 0),
        };

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index]
                if (header !== null) {
                    acc[header] = cell
                }

                return acc
            }, {})
        })

        // Format amount and date correctly
        const formattedData = arrayOfData.map((item) => {
            // Trim the date string to remove any leading or trailing whitespace
            const trimmedDate = item.date ? item.date.trim() : null;
        
            // Check if the date already has a time part (HH:mm:ss)
            const isDateTimeFormat = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(trimmedDate);
            const formattedDate = trimmedDate
                ? isDateTimeFormat
                    ? trimmedDate  // If the date already has time, keep it as is
                    : `${trimmedDate} 00:00:00`  // Add default time "00:00:00"
                : null;
        
            return {
                ...item,
                amount: item.amount ? convertAmountToMiliunits(parseFloat(item.amount)) : 0,  // Ensure amount is a valid number
                date: formattedDate,  // Use formatted date with time part
                payee: item.payee || 'Unknown Payee',  // Fallback value if 'payee' is missing
            };
        });
        
        // Log formattedData before schema validation
        console.log("Formatted Data before schema validation:", formattedData);
        
        // Define the Zod schema and use the `dateSchema`
        const schema = z.array(
            z.object({
                amount: z.number(),
                date: dateSchema.optional(),
                payee: z.string(),
            })
        );
        
        try {
            // Validate the formatted data
            schema.parse(formattedData);
            
            // Submit the data if validation is successful
            onSubmit(formattedData);
            console.log("Data submitted:", formattedData);  // Log submitted data
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation errors:", error.errors);  // Log validation errors
            } else {
                console.error("Unexpected error:", error);  // Log any other errors
            }
        }
        
        
        
        
        
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transaction
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            onClick={onCancel} 
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            disabled={progress < requiredOptions.length}
                            onClick={handleContinue}
                            className="w-full lg:w-auto"
                        >
                            Continue ({progress} / {requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable 
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    )
} */






