-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "subscription_tier" TEXT NOT NULL DEFAULT 'free',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "player_name" TEXT,
    "team" TEXT,
    "sport" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT,
    "set_name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "card_number" TEXT,
    "parallel" TEXT,
    "is_rookie" BOOLEAN NOT NULL DEFAULT false,
    "is_autograph" BOOLEAN NOT NULL DEFAULT false,
    "is_numbered" BOOLEAN NOT NULL DEFAULT false,
    "print_run" INTEGER,
    "image_url" TEXT,
    "external_id" TEXT,
    "data_source" TEXT NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_cards" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "condition" TEXT NOT NULL DEFAULT 'raw',
    "grade_company" TEXT,
    "grade_value" TEXT,
    "cert_number" TEXT,
    "purchase_price" DECIMAL(10,2),
    "purchase_date" TIMESTAMP(3),
    "purchase_platform" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_collection',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "grade_label" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "source" TEXT NOT NULL,
    "platform" TEXT,
    "sale_date" TIMESTAMP(3) NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sealed_products" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "product_type" TEXT NOT NULL,
    "manufacturer" TEXT,
    "year" INTEGER NOT NULL,
    "set_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "purchase_platform" TEXT,
    "current_value" DECIMAL(10,2),
    "status" TEXT NOT NULL DEFAULT 'sealed',
    "notes" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sealed_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sealed_price_history" (
    "id" TEXT NOT NULL,
    "sealed_product_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "source" TEXT NOT NULL,
    "sale_date" TIMESTAMP(3) NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sealed_price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "matched_card_id" TEXT,
    "image_url" TEXT,
    "api_provider" TEXT,
    "confidence_score" DECIMAL(5,4),
    "was_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "target_price" DECIMAL(10,2),
    "notify_above" BOOLEAN NOT NULL DEFAULT false,
    "notify_below" BOOLEAN NOT NULL DEFAULT true,
    "grade_label" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "cards_sport_year_idx" ON "cards"("sport", "year");

-- CreateIndex
CREATE INDEX "cards_player_name_idx" ON "cards"("player_name");

-- CreateIndex
CREATE INDEX "cards_external_id_idx" ON "cards"("external_id");

-- CreateIndex
CREATE INDEX "user_cards_user_id_idx" ON "user_cards"("user_id");

-- CreateIndex
CREATE INDEX "user_cards_card_id_idx" ON "user_cards"("card_id");

-- CreateIndex
CREATE INDEX "price_history_card_id_grade_label_idx" ON "price_history"("card_id", "grade_label");

-- CreateIndex
CREATE INDEX "price_history_sale_date_idx" ON "price_history"("sale_date");

-- CreateIndex
CREATE INDEX "sealed_products_user_id_idx" ON "sealed_products"("user_id");

-- CreateIndex
CREATE INDEX "sealed_products_category_year_idx" ON "sealed_products"("category", "year");

-- CreateIndex
CREATE INDEX "sealed_price_history_sealed_product_id_idx" ON "sealed_price_history"("sealed_product_id");

-- CreateIndex
CREATE INDEX "scan_logs_user_id_idx" ON "scan_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_user_id_card_id_key" ON "watchlist"("user_id", "card_id");

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sealed_products" ADD CONSTRAINT "sealed_products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sealed_price_history" ADD CONSTRAINT "sealed_price_history_sealed_product_id_fkey" FOREIGN KEY ("sealed_product_id") REFERENCES "sealed_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_matched_card_id_fkey" FOREIGN KEY ("matched_card_id") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
