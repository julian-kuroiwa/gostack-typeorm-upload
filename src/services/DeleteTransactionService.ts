import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!isUuid(id)) {
      throw new AppError('Please insert a valid id', 401);
    }

    const findTransaction = transactionsRepository.findOne({
      where: { id },
    });

    if (!findTransaction) {
      throw new AppError('Transaction not found');
    }

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
