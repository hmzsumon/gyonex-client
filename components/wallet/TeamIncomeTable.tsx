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
import { formatBalance } from '@/lib/functions';

interface TeamIncomeTableProps {
	walletData: {
		teamADailyIncome: number;
		teamATotalIncome: number;
		teamBDailyIncome: number;
		teamBTotalIncome: number;
		teamCDailyIncome: number;
		teamCTotalIncome: number;
	};
}

export function TeamIncomeTable({ walletData }: TeamIncomeTableProps) {
	const items = [
		{
			id: 1,
			purpose: 'Team A',
			daily_amount: walletData?.teamADailyIncome,
			total_amount: walletData?.teamATotalIncome,
		},
		{
			id: 2,
			purpose: 'Team B',
			daily_amount: walletData?.teamBDailyIncome,
			total_amount: walletData?.teamBTotalIncome,
		},
		{
			id: 3,
			purpose: 'Team C',
			daily_amount: walletData?.teamCDailyIncome,
			total_amount: walletData?.teamCTotalIncome,
		},
	];
	return (
		<Table>
			<TableHeader className='text-xs'>
				<TableRow>
					<TableHead className=' text-gray-800 font-bold'>Purpose 🔖</TableHead>
					<TableHead className=' text-gray-800  font-bold text-center'>
						Daily Income 💵
					</TableHead>
					<TableHead className=' text-gray-800 font-bold text-right'>
						Total Income 💰
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className='text-xs'>
				{items.map((item) => (
					<TableRow key={item.id}>
						<TableCell className='font-medium'>{item.purpose}</TableCell>
						<TableCell className='text-center'>
							{formatBalance(item.daily_amount)} $
						</TableCell>
						<TableCell className=' text-right'>
							{formatBalance(item.total_amount)} $
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
