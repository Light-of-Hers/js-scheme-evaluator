(define (not a) (if a #f #t))

(define (list . lst) lst)

(define (exist pred lst)
    (cond 
        [(null? lst) #f]
        [(pred (car lst)) #t]
        [else (exist pred (cdr lst))]))

(define (forall pred lst)
    (cond 
        [(null? lst) #t]
        [(pred (car lst)) (forall pred (cdr lst))]
        [else #f]))

(define (map fun . lsts)
    (define (single-map fun lst)
        (if (null? lst)
            '()
            (cons (fun (car lst)) (single-map fun (cdr lst)))))
    (define (multi-map fun lsts)
        (if (exist null? lsts)
            '()
            (cons 
                (apply fun (single-map car lsts))
                (multi-map fun (single-map cdr lsts)))))
    (multi-map fun lsts))

(define (foldl fun init lst)
    (let iter ([acc init] [lst lst])
        (if (null? lst)
            acc
            (iter (fun acc (car lst)) (cdr lst)))))
    
(define (foldr fun init lst)
    (if (null? lst)
        init 
        (fun (car lst) (foldr fun init (cdr lst)))))

(define (length lst)
    (foldl (lambda (acc v) (+ acc 1)) 0 lst))

(define (filter pred lst)
    (foldr 
        (lambda (v lst)
            (if (pred v)
                (cons v lst)
                lst))
        '() lst))

(define (append . lsts)
    (foldr (lambda (l1 l2) (foldr cons l2 l1)) '() lsts))

(define (partial fun . cached-args)
    (lambda args (apply fun (append cached-args args))))

(define zip (partial map list))

(define (flat-map . args)
    (apply append (apply map args)))

(define interleave (partial flat-map list))

(define reverse (partial foldl (lambda (acc cur) (cons cur acc)) '()))
