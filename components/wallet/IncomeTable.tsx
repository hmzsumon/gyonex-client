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

interface IncomeTableProps {
	wallet: {
		personalTradeTotalProfit: number;
		personalTradeDailyProfit: number;
		signalTradeTotalProfit: number;
		signalTradeDailyProfit: number;
		liveTradeTotalProfit: number;
		liveTradeDailyProfit: number;
		teamDailyIncome: number;
		teamTotalIncome: number;
	};
}

export function IncomeTable({ wallet }: IncomeTableProps) {
	const items = [
		{
			id: 1,
			purpose: 'Personal trade',
			daily_amount: wallet?.personalTradeDailyProfit,
			total_amount: wallet?.personalTradeTotalProfit,
		},
		{
			id: 2,
			purpose: 'Signal trade',
			daily_amount: wallet?.signalTradeDailyProfit,
			total_amount: wallet?.signalTradeTotalProfit,
		},
		{
			id: 3,
			purpose: 'Live trade',
			daily_amount: wallet?.liveTradeDailyProfit,
			total_amount: wallet?.liveTradeTotalProfit,
		},
		{
			id: 4,
			purpose: 'Team',
			daily_amount: wallet?.teamDailyIncome,
			total_amount: wallet?.teamTotalIncome,
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
						<TableCell className='font-medium '>{item.purpose}</TableCell>
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
