import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const items = [
	{
		id: 1,
		purpose: 'Rank Reward',
		total_amount: '$0.00',
	},
	{
		id: 2,
		purpose: 'Offer',

		total_amount: '$0.00',
	},
	{
		id: 3,
		purpose: 'Gift',

		total_amount: '$0.00',
	},
];

export function IncentiveIncomeTable() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className=' text-gray-50 font-bold'>Purpose</TableHead>
					<TableHead className=' text-gray-50 font-bold text-right'>
						Total Amount
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => (
					<TableRow key={item.id} className='text-xs'>
						<TableCell className='font-medium'>{item.purpose}</TableCell>
						<TableCell className=' text-right'>{item.total_amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
