package me.seyrek.library_management_system.copy.service;

import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.book.repository.BookRepository;
import me.seyrek.library_management_system.copy.dto.*;
import me.seyrek.library_management_system.copy.mapper.CopyMapper;
import me.seyrek.library_management_system.copy.model.Copy;
import me.seyrek.library_management_system.copy.model.CopyStatus;
import me.seyrek.library_management_system.copy.repository.CopyRepository;
import me.seyrek.library_management_system.copy.repository.CopySpecification;
import me.seyrek.library_management_system.exception.ErrorCode;
import me.seyrek.library_management_system.exception.client.BusinessException;
import me.seyrek.library_management_system.exception.client.DuplicateResourceException;
import me.seyrek.library_management_system.exception.client.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CopyServiceImpl implements CopyService {

    private final CopyRepository copyRepository;
    private final BookRepository bookRepository;
    private final CopyMapper copyMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<CopyDto> getAllCopies(CopySearchRequest request, Pageable pageable) {
        Specification<Copy> spec = CopySpecification.withDynamicQuery(
                request.barcode(),
                request.isbn(),
                request.bookId(),
                request.copyStatus()
        );

        return copyRepository.findAll(spec, pageable)
                .map(copyMapper::toCopyDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CopyDto> getCopiesByBookId(Long bookId, Pageable pageable) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Cannot find copies for a non-existent book with id: " + bookId, ErrorCode.BOOK_NOT_FOUND);
        }
        return copyRepository.findByBookId(bookId, pageable).map(copyMapper::toCopyDto);
    }

    @Override
    @Transactional(readOnly = true)
    public CopyDto getCopyById(Long id) {
        return copyRepository.findById(id)
                .map(copyMapper::toCopyDto)
                .orElseThrow(() -> new ResourceNotFoundException("Copy not found with id: " + id, ErrorCode.COPY_NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public Copy getCopyEntityById(Long id) {
        return copyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Copy not found with id: " + id, ErrorCode.COPY_NOT_FOUND));
    }

    @Override
    public CopyDto getCopyByBarcode(String barcode) {
        return copyRepository.findByBarcode(barcode)
                .map(copyMapper::toCopyDto)
                .orElseThrow(() -> new ResourceNotFoundException("Copy not found with barcode: " + barcode, ErrorCode.COPY_NOT_FOUND));
    }

    @Override
    public CopyDto createCopy(CopyCreateRequest request) {
        if (copyRepository.existsByBarcode(request.barcode())) {
            throw new DuplicateResourceException("Copy with barcode " + request.barcode() + " already exists.", ErrorCode.COPY_ALREADY_EXISTS);
        }

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.bookId(), ErrorCode.BOOK_NOT_FOUND));

        Copy copy = copyMapper.fromCopyCreateRequest(request);
        copy.setBook(book);

        return copyMapper.toCopyDto(copyRepository.save(copy));
    }

    // TODO: what happens if I update or patch a borrowed Copy?
    @Override
    public CopyDto updateCopy(Long id, CopyUpdateRequest request) {
        Copy existingCopy = copyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Copy not found with id: " + id, ErrorCode.COPY_NOT_FOUND));

        if (!request.barcode().equals(existingCopy.getBarcode())) {
            copyRepository.findByBarcode(request.barcode()).ifPresent(copy -> {
                if (!copy.getId().equals(id)) {
                    throw new DuplicateResourceException("Copy with barcode " + request.barcode() + " already exists.", ErrorCode.COPY_ALREADY_EXISTS);
                }
            });
        }

        copyMapper.updateCopyFromRequest(request, existingCopy);

        return copyMapper.toCopyDto(copyRepository.save(existingCopy));
    }

    @Override
    public CopyDto patchCopy(Long id, CopyPatchRequest request) {
        Copy existingCopy = copyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Copy not found with id: " + id, ErrorCode.COPY_NOT_FOUND));

        if (request.barcode() != null && !request.barcode().equals(existingCopy.getBarcode())) {
            copyRepository.findByBarcode(request.barcode()).ifPresent(copy -> {
                if (!copy.getId().equals(id)) {
                    throw new DuplicateResourceException("Copy with barcode " + request.barcode() + " already exists.", ErrorCode.COPY_ALREADY_EXISTS);
                }
            });
        }

        copyMapper.patchCopyFromRequest(request, existingCopy);

        return copyMapper.toCopyDto(copyRepository.save(existingCopy));
    }

    // TODO: buralarda sıkıntı çıkabilir :D

    @Override
    @Transactional
    public void retireCopy(Long id) {
        Copy copy = getCopyEntityById(id);
        copy.setStatus(CopyStatus.RETIRED);
        copyRepository.save(copy);
    }

    @Override
    @Transactional
    public void loanCopy(Long id) {
        Copy copy = getCopyEntityById(id);
        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new BusinessException("Copy is not available for loan. Current status: " + copy.getStatus(), ErrorCode.COPY_NOT_AVAILABLE);
        }
        copy.setStatus(CopyStatus.LOANED);
        copyRepository.save(copy);
    }

    @Override
    @Transactional
    public void returnCopy(Long id) {
        Copy copy = getCopyEntityById(id);
        if (copy.getStatus() != CopyStatus.LOANED) {
            throw new BusinessException("Cannot return a copy that is not on loan.", ErrorCode.COPY_NOT_ON_LOAN);
        }
        copy.setStatus(CopyStatus.AVAILABLE);
        copyRepository.save(copy);
    }

    @Override
    @Transactional
    public void reportLost(Long id) {
        Copy copy = getCopyEntityById(id);
        copy.setStatus(CopyStatus.LOST);
        copyRepository.save(copy);
    }

    @Override
    @Transactional
    public void reportDamaged(Long id) {
        Copy copy = getCopyEntityById(id);
        copy.setStatus(CopyStatus.MAINTENANCE);
        copyRepository.save(copy);
    }
}
