import { withJsonFormsControlProps } from '@jsonforms/react'
import { Rating } from './Rating'

interface RatingControlProps {
  data: number
  handleChange(path: string, value: number): void
  path: string
  label?: string
}

const RatingControl = ({ data, handleChange, path, label }: RatingControlProps) => (
  <Rating
    value={data}
    updateValue={(newValue: number) => handleChange(path, newValue)}
    label={label}
  />
)

export default withJsonFormsControlProps(RatingControl)
